"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ProfileForm from "./_components/profile-form"
import { getProfileAction } from "@/actions/db/profiles-actions"

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const { data: profile } = await getProfileAction(userId as string)

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-4xl font-bold">Profile</h1>
      <ProfileForm userId={userId as string} initialData={profile} />
    </div>
  )
} 