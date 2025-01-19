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

    // Send welcome message
    const sent = await sendWhatsAppMessage(
      phoneNumber,
      "Welcome to Lettercast!"
    )

    if (!sent) {
      return {
        isSuccess: false,
        message: "Failed to send WhatsApp message",
        data: undefined
      }
    }

    return {
      isSuccess: true,
      message: "WhatsApp welcome message sent successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error sending WhatsApp welcome message:", error)
    return {
      isSuccess: false,
      message: "Failed to send WhatsApp welcome message",
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