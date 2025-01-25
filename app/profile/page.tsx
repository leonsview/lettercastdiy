"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ProfileForm from "./_components/profile-form"
import { getProfileAction } from "@/actions/db/profiles-actions"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

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