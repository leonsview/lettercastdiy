/*
<ai_context>
This file contains server actions for WhatsApp functionality.
</ai_context>
*/

"use server"

import { checkWhatsAppNumber, sendWhatsAppMessage, sendWhatsAppFile } from "@/lib/green-api"
import { ActionState } from "@/types"

export async function sendWhatsAppWelcomeAction(
  phoneNumber: string
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
      "https://uvctvecbobqepkqrcshc.supabase.co/storage/v1/object/public/Podcast%20Audio%20Files/Mindful-Media-Consumption-lettercast.opus?t=2025-01-25T15%3A04%3A55.487Z",
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
      "You will hear from us in a week!\nIn the meantime: if you have questions / feedback / suggestions, feel free to just text us in this WhatsApp chat."
    )

    if (!finalMessage) {
      return {
        isSuccess: false,
        message: "Failed to send final message",
        data: undefined
      }
    }

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