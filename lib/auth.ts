"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db/db"
import { eq } from "drizzle-orm"
import { profilesTable } from "@/db/schema"
import { redirect } from "next/navigation"

export async function checkUserMembership() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/login")
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))

  if (profile?.membership !== "pro") {
    redirect("/subscribe")
  }

  return profile
} 