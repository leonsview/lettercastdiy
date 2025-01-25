/*
<ai_context>
This file contains server actions for WhatsApp functionality.
</ai_context>
*/

"use server"

import { checkWhatsAppNumber, sendWhatsAppMessage, sendWhatsAppFile } from "@/lib/green-api"
import { ActionState } from "@/types"
import { db } from "@/db/db"
import { profilesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function sendWhatsAppWelcomeAction(
  phoneNumber: string,
  userId: string
): Promise<ActionState<void>> {
  try {
    // First check if we should send the welcome message
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1)

    if (!profile) {
      return {
        isSuccess: false,
        message: "Profile not found",
        data: undefined
      }
    }

    // Only send welcome if:
    // 1. Welcome was never sent (welcomeSent is false) OR
    // 2. This is a new phone number (different from lastWelcomedPhone)
    if (profile.welcomeSent && profile.lastWelcomedPhone === phoneNumber) {
      return {
        isSuccess: true,
        message: "Welcome message already sent to this number",
        data: undefined
      }
    }

    // Check if the phone number is on WhatsApp
    const exists = await checkWhatsAppNumber(phoneNumber)
    if (!exists) {
      return {
        isSuccess: false,
        message: "Phone number is not registered on WhatsApp",
        data: undefined
      }
    }

    // Send welcome messages in sequence
    const welcomeMessage = await sendWhatsAppMessage(
      phoneNumber,
      "Welcome to lettercast! \nThanks for signing up :)\n\nYou will receive your first personalized lettercast in one week based on the newsletters you saved in your profile. \n\nIn the meantime, here is an episode for you about the topic of content curation (the very idea that lettercast emerged from)."
    )

    if (!welcomeMessage) {
      return {
        isSuccess: false,
        message: "Failed to send welcome message",
        data: undefined
      }
    }

    // Send the audio file
    const audioMessage = await sendWhatsAppFile(
      phoneNumber,
      "https://uvctvecbobqepkqrcshc.supabase.co/storage/v1/object/public/Podcast%20Audio%20Files/Mindful%20Media%20Consumption%20lettercast.mp3?t=2025-01-25T15%3A12%3A43.444Z",
      ""
    )

    if (!audioMessage) {
      return {
        isSuccess: false,
        message: "Failed to send audio message",
        data: undefined
      }
    }

    // Send final message
    const finalMessage = await sendWhatsAppMessage(
      phoneNumber,
      "You will hear from us in a week!\n\nIf you any have questions / feedback / suggestions, feel free to just text us in this WhatsApp chat."
    )

    if (!finalMessage) {
      return {
        isSuccess: false,
        message: "Failed to send final message",
        data: undefined
      }
    }

    // Update profile to mark welcome message as sent
    await db.update(profilesTable)
      .set({ 
        welcomeSent: true,
        lastWelcomedPhone: phoneNumber 
      })
      .where(eq(profilesTable.userId, userId))

    return {
      isSuccess: true,
      message: "WhatsApp welcome messages sent successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error sending WhatsApp welcome messages:", error)
    return {
      isSuccess: false,
      message: "Failed to send WhatsApp welcome messages",
      data: undefined
    }
  }
}

export async function sendWhatsAppPodcastAction(
  phoneNumber: string,
  audioUrl: string
): Promise<ActionState<void>> {
  try {
    // First check if the phone number is on WhatsApp
    const exists = await checkWhatsAppNumber(phoneNumber)
    if (!exists) {
      return {
        isSuccess: false,
        message: "Phone number is not registered on WhatsApp",
        data: undefined
      }
    }

    // Send notification message first
    const messageSent = await sendWhatsAppMessage(
      phoneNumber,
      "🎙️ Your lettercast is ready! \n\nYou received the following newsletters:\n\n📩 AI Solopreneur: \n12 boring AI opportunities quietly making millions rn\n\n📩 The Rundown AI:\nChatGPT gets proactive with 'Tasks'\n\nSending the audio file now..."
    )

    if (!messageSent) {
      return {
        isSuccess: false,
        message: "Failed to send WhatsApp notification",
        data: undefined
      }
    }

    // Send the audio file
    const fileSent = await sendWhatsAppFile(
      phoneNumber,
      audioUrl,
      "Here's your podcast! 🎧"
    )

    if (!fileSent) {
      return {
        isSuccess: false,
        message: "Failed to send podcast audio file",
        data: undefined
      }
    }

    return {
      isSuccess: true,
      message: "Podcast sent via WhatsApp successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error sending podcast via WhatsApp:", error)
    return {
      isSuccess: false,
      message: "Failed to send podcast via WhatsApp",
      data: undefined
    }
  }
} 