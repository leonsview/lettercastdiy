"use server"

import { db } from "@/db/db"
import { newslettersTable } from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function checkNewsletterExistsAction(
  newsletterEmailId: string
): Promise<ActionState<boolean>> {
  try {
    const newsletter = await db.query.newsletters.findFirst({
      where: eq(newslettersTable.newsletterEmailId, newsletterEmailId)
    })

    return {
      isSuccess: true,
      message: "Newsletter check completed",
      data: !!newsletter
    }
  } catch (error) {
    console.error("Error checking newsletter:", error)
    return { isSuccess: false, message: "Failed to check newsletter" }
  }
}

export async function createNewsletterAction(
  newsletterEmailId: string
): Promise<ActionState<void>> {
  try {
    await db.insert(newslettersTable).values({
      newsletterEmailId: newsletterEmailId,
      subscribed: false
    })

    return {
      isSuccess: true,
      message: "Newsletter created successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error creating newsletter:", error)
    return { isSuccess: false, message: "Failed to create newsletter" }
  }
}