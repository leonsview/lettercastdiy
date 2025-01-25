"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ProfileForm from "./_components/profile-form"
import { getProfileAction } from "@/actions/db/profiles-actions"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { stripe } from "@/lib/stripe"
import { updateStripeCustomer, manageSubscriptionStatusChange } from "@/actions/stripe-actions"

interface SearchParams {
  session_id?: string
}

export default async function ProfilePage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  // Handle checkout session verification
  const sessionId = searchParams.session_id
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.payment_status === "paid") {
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string
        
        // Update customer and subscription status
        await updateStripeCustomer(userId, subscriptionId, customerId)
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const productId = subscription.items.data[0].price.product as string
        await manageSubscriptionStatusChange(subscriptionId, customerId, productId)
      }
    } catch (error) {
      console.error("Error verifying session:", error)
    }
  }

  const { data: profile } = await getProfileAction(userId as string)
  
  // Redirect to subscribe page if not pro
  if (!profile || profile.membership !== "pro") {
    redirect("/subscribe")
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-4xl font-bold">Your lettercast profile</h1>
      <ProfileForm userId={userId as string} initialData={profile} />

      <div className="fixed bottom-8 right-8 flex flex-col gap-2">
        <Link 
          href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_LINK || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-[200px]" size="sm" variant="outline">
            <CreditCard className="mr-2 h-3 w-3" />
            Manage Subscription
          </Button>
        </Link>

        <SignOutButton>
          <button className="w-[200px] rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  )
} 