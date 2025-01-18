// app/api/generate-test/route.ts
import { generateAudioFromScript } from '@/actions/generate-audio';
import { db } from '@/db/db';
import { podcasts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the podcast first to check the script
    const podcast = await db.query.podcasts.findFirst({
      where: eq(podcasts.id, 3)
    });

    if (!podcast || !podcast.script) {
      return Response.json({ error: 'No script found' }, { status: 404 });
    }

    console.log('Found script:', podcast.script);
    
    const result = await generateAudioFromScript(3);

    return Response.json({ 
      success: true, 
      result,
      message: 'Audio generated successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate audio' }, 
      { status: 500 }
    );
  }
}