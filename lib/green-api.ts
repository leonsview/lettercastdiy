/*
<ai_context>
This file contains the Green API client for WhatsApp integration.
</ai_context>
*/

const BASE_URL = "https://api.green-api.com"
const ID_INSTANCE = process.env.GREEN_API_INSTANCE_ID!
const API_TOKEN = process.env.GREEN_API_TOKEN!

function getUrl(endpoint: string) {
  const url = `${BASE_URL}/waInstance${ID_INSTANCE}/${endpoint}/${API_TOKEN}`
  console.log("Green API URL:", url)
  return url
}

function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters (spaces, +, -, (, ), etc.)
  let formatted = phoneNumber.replace(/\D/g, "")
  
  // If it starts with a leading zero, remove it
  if (formatted.startsWith("0")) {
    formatted = formatted.substring(1)
  }
  
  console.log("Formatted phone number:", formatted)
  return formatted
}

export async function checkWhatsAppNumber(phoneNumber: string): Promise<boolean> {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber)
    console.log("Checking WhatsApp for number:", formattedNumber)
    
    const response = await fetch(
      getUrl("checkWhatsapp"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: formattedNumber
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Green API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }
    
    const text = await response.text()
    console.log("Green API Response:", text)
    
    try {
      const data = JSON.parse(text)
      return data.existsWhatsapp
    } catch (e) {
      console.error("Failed to parse response:", text)
      throw e
    }
  } catch (error) {
    console.error("Error checking phone:", error)
    return false
  }
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber)
    console.log("Sending WhatsApp message to:", formattedNumber)
    
    const response = await fetch(
      getUrl("sendMessage"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId: `${formattedNumber}@c.us`,
          message
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Green API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }
    
    const text = await response.text()
    console.log("Green API Response:", text)
    
    try {
      const data = JSON.parse(text)
      return !!data.idMessage
    } catch (e) {
      console.error("Failed to parse response:", text)
      throw e
    }
  } catch (error) {
    console.error("Error sending message:", error)
    return false
  }
}

export async function sendWhatsAppFile(phoneNumber: string, fileUrl: string, caption?: string): Promise<boolean> {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber)
    console.log("Sending WhatsApp file to:", formattedNumber)
    
    const response = await fetch(
      getUrl("sendFileByUrl"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId: `${formattedNumber}@c.us`,
          urlFile: fileUrl,
          fileName: "podcast.mp3",
          caption
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Green API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }
    
    const text = await response.text()
    console.log("Green API Response:", text)
    
    try {
      const data = JSON.parse(text)
      return !!data.idMessage
    } catch (e) {
      console.error("Failed to parse response:", text)
      throw e
    }
  } catch (error) {
    console.error("Error sending file:", error)
    return false
  }
}