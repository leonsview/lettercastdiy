// app/actions/generate-audio.ts
'use server'

import { generateConversationalPodcast } from '@/lib/autocontent';
import { db } from '@/db/db';
import { podcasts, profilesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendWhatsAppPodcastAction } from '@/actions/whatsapp-actions';

export async function generateAudioFromScript(podcastId: number) {
  try {
    // Get the script from DB
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcasts.id, podcastId)
    });

    if (!podcast) {
      throw new Error('Podcast not found');
    }

    if (!podcast.script) {
      throw new Error('No script found for podcast');
    }

    // Generate audio using the script
    const result = await generateConversationalPodcast(
      podcast.script,
      podcast.userId
    );

    // Update the podcast with the audio URL
    await db.update(podcasts)
      .set({ audioUrl: result.audioUrl })
      .where(eq(podcasts.id, podcastId));

    // Get the user's phone number from their profile
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, podcast.userId)
    });

    // If user has a phone number, send them a WhatsApp notification
    if (profile?.phone) {
      await sendWhatsAppPodcastAction(profile.phone, result.audioUrl);
    }

    return result;

  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio');
  }
}
