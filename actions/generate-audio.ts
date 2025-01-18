// app/actions/generate-audio.ts
'use server'

import { generateConversationalPodcast } from '@/lib/autocontent';
import { db } from '@/db/db';
import { podcasts } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    return result;

  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio');
  }
}
