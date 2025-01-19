import { db } from "@/db/db"
import { podcasts, profilesTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendWhatsAppPodcastAction } from "@/actions/whatsapp-actions"

export async function GET() {
  try {
    // Use a specific podcast ID and user ID for testing
    const podcastId = 6 // Replace with an existing podcast ID
    const userId = "user_2rniuxA4mw3xkouh5PiKTyQtv0W" // Replace with an existing user ID

    // Get the podcast
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcasts.id, podcastId)
    })

    if (!podcast || !podcast.audioUrl) {
      return Response.json(
        { error: "Podcast not found or no audio URL" },
        { status: 404 }
      )
    }

    // Get the user's profile
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })

    if (!profile || !profile.phone) {
      return Response.json(
        { error: "User profile not found or no phone number" },
        { status: 404 }
      )
    }

    // Send WhatsApp notification
    const result = await sendWhatsAppPodcastAction(profile.phone, podcast.audioUrl)

    if (!result.isSuccess) {
      return Response.json(
        { error: result.message },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      message: "WhatsApp notification sent successfully",
      podcast: {
        id: podcast.id,
        audioUrl: podcast.audioUrl
      },
      user: {
        id: profile.userId,
        phone: profile.phone
      }
    })
  } catch (error) {
    console.error("Error in test endpoint:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    )
  }
} 