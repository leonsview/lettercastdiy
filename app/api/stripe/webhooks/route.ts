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

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      console.error("Missing webhook secret or signature", { sig, webhookSecret })
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log("Webhook event received:", {
      type: event.type,
      id: event.id,
      data: JSON.stringify(event.data.object)
    })
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`, { sig, webhookSecret })
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          console.log("Processing subscription change event", {
            type: event.type,
            data: JSON.stringify(event.data.object)
          })
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          console.log("Processing checkout completion event", {
            type: event.type,
            data: JSON.stringify(event.data.object)
          })
          await handleCheckoutSession(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400
        }
      )
    }
  }

  return new Response(JSON.stringify({ received: true }))
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

  return new Response(JSON.stringify({ received: true }))
}
