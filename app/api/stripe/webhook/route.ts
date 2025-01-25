/*
<ai_context>
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
</ai_context>
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

// This is needed to disable body parsing, as we need the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  console.log("Webhook request received")
  
  // Get the raw body and headers
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  console.log("Request headers:", {
    signature: signature?.substring(0, 20),
    hasSecret: !!webhookSecret
  })

  if (!signature || !webhookSecret) {
    console.error("Missing webhook secret or signature")
    return new Response(
      JSON.stringify({ error: "Missing webhook secret or signature" }), 
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log("Event constructed successfully:", event.type)

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            console.log("Processing subscription change")
            await handleSubscriptionChange(event)
            break

          case "checkout.session.completed":
            console.log("Processing checkout completion")
            await handleCheckoutSession(event)
            break

          default:
            console.log(`Unhandled event type: ${event.type}`)
        }
      } catch (error) {
        console.error("Error processing webhook:", error)
        return new Response(
          JSON.stringify({ 
            error: "Webhook processing failed",
            details: error instanceof Error ? error.message : "Unknown error"
          }), 
          { status: 400 }
        )
      }
    } else {
      console.log(`Ignoring irrelevant event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return new Response(
      JSON.stringify({ 
        error: "Webhook signature verification failed",
        details: err instanceof Error ? err.message : "Unknown error"
      }), 
      { status: 400 }
    )
  }
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  console.log("Checkout session data:", {
    mode: checkoutSession.mode,
    clientReferenceId: checkoutSession.client_reference_id,
    customerId: checkoutSession.customer,
    subscriptionId: checkoutSession.subscription,
    paymentStatus: checkoutSession.payment_status,
    status: checkoutSession.status
  })

  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    const userId = checkoutSession.client_reference_id
    const customerId = checkoutSession.customer as string

    if (!userId) {
      console.error("No userId found in checkout session")
      throw new Error("No userId found in checkout session")
    }

    console.log("Updating stripe customer", { userId, subscriptionId, customerId })
    try {
      // Update the customer with their subscription info
      const customerUpdateResult = await updateStripeCustomer(
        userId,
        subscriptionId,
        customerId
      )
      console.log("Customer update result:", customerUpdateResult)

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const productId = subscription.items.data[0].price.product as string

      console.log("Managing subscription status", { subscriptionId, customerId, productId })
      // Update subscription status
      const statusUpdateResult = await manageSubscriptionStatusChange(
        subscription.id,
        customerId,
        productId
      )
      console.log("Status update result:", statusUpdateResult)
    } catch (error) {
      console.error("Error in handleCheckoutSession:", error)
      throw error
    }
  }
} 