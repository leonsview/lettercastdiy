"use server"

import ProfileForm from "./profile/_components/profile-form"
import { getProfileAction } from "@/actions/db/profiles-actions"

export default async function ProfilePage() {
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-4xl font-bold">Your lettercast profile</h1>
      <ProfileForm />
    </div>
  )
} 