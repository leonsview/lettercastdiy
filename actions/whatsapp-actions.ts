/*
<ai_context>
This file contains server actions for WhatsApp functionality.
</ai_context>
*/

"use server"

import { checkWhatsAppNumber, sendWhatsAppMessage } from "@/lib/green-api"
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