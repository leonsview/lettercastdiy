import { stripe } from "@/lib/stripe"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/profile?success=true`,
      cancel_url: `${baseUrl}/subscribe?canceled=true`,
      mode: "subscription",
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      client_reference_id: userId,
      customer_email: undefined, // Clerk will provide this
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      metadata: {
        userId: userId // Redundant but useful for webhook processing
      }
    })

    if (!session?.url) {
      console.error("No session URL returned from Stripe")
      return new NextResponse("Error creating checkout session", { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error", 
      { status: 500 }
    )
  }
} 