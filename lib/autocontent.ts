import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface Resource {
  content: string;
  type: 'text' | 'youtube' | 'website' | 'pdf';
}

interface AutoContentStatus {
  id: string;
  requested_on: string;
  status: number;
  updated_on: string;
  request_json: string;
  error_message: string | null;
  audio_url: string | null;
  audio_title: string | null;
  response_text: string | null;
  citations: Array<{
    citationDocument: string;
    citationTitle: string;
    citationText: string;
  }>;
}

interface AudioResult {
  audioUrl: string;
}

function getPollingInterval(status: number): number {
  // Status codes and their polling intervals in milliseconds
  if (status === 0) return 5000;  // Queued - check frequently
  if (status <= 30) return 10000; // Initial setup - check every 10s
  if (status <= 60) return 20000; // Configuration - check every 20s
  if (status <= 80) return 30000; // Podcast generation - check every 30s
  return 15000; // Final stages - check more frequently again
}

async function generateAudioContent(script: string): Promise<AudioResult> {
  const response = await fetch(
    "https://api.autocontentapi.com/content/create",
    {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AUTOCONTENT_API_KEY}`,
      },
      body: JSON.stringify({
        resources: [
          {
            content: script,
            type: "text"
          }
        ],
        text: "Create a natural, conversational podcast from this script, the duration should be 10-15 minutes (15 minutes is the maximum!)",
        outputType: "audio",
        includeCitations: false
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate audio content: ${response.status} ${errorText}`);
  }

  const { request_id, error_message } = await response.json();
  
  if (error_message) {
    throw new Error(`AutoContent API error: ${error_message}`);
  }

  if (!request_id) {
    throw new Error('No request ID returned from AutoContent API');
  }

  console.log('Generation started with request ID:', request_id);

  // Poll for the audio file
  return await pollForAudio(request_id);
}

async function pollForAudio(requestId: string, maxAttempts = 120): Promise<AudioResult> {
  console.log('Starting to poll for audio...');
  let lastStatus = -1;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(
        `https://api.autocontentapi.com/content/status/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.AUTOCONTENT_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check audio status: ${response.status} ${errorText}`);
      }

      const data: AutoContentStatus = await response.json();
      
      // Only log if status has changed
      if (data.status !== lastStatus) {
        console.log('Status update:', {
          status: data.status,
          message: getStatusMessage(data.status),
          title: data.audio_title
        });
        lastStatus = data.status;
      }
      
      if (data.error_message) {
        throw new Error(`AutoContent API error: ${data.error_message}`);
      }

      if (data.status === 100 && data.audio_url) {
        console.log('Audio generation completed, URL:', data.audio_url);
        return { audioUrl: data.audio_url };
      }

      // Calculate next polling interval based on status
      const interval = getPollingInterval(data.status);
      console.log(`Waiting ${interval/1000}s before next check...`);
      await new Promise(resolve => setTimeout(resolve, interval));
      
    } catch (error) {
      console.error('Error polling for audio:', error);
      // Only throw if it's the last attempt
      if (i === maxAttempts - 1) throw error;
      // On error, wait 10s before retry
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  throw new Error(`Timeout waiting for audio generation after ${maxAttempts} attempts`);
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 0: return 'Request queued';
    case 10: return 'Opening browser and accessing Google account';
    case 20: return 'Logged in, creating a notebook';
    case 30: return 'Adding resources to the notebook';
    case 60: return 'Configuring output type';
    case 80: return 'Waiting for podcast to finish';
    case 90: return 'Podcast finished, downloading audio';
    case 100: return 'Completed successfully';
    default: return `Unknown status: ${status}`;
  }
}

export async function generateConversationalPodcast(script: string, userId: string) {
  try {
    console.log('Starting podcast generation for user:', userId);
    console.log('Script length:', script.length, 'characters');
    
    // Generate audio using AutoContent API
    const result = await generateAudioContent(script);
    console.log('Audio generated successfully');

    return { success: true, audioUrl: result.audioUrl };

  } catch (error) {
    console.error('Error in generateConversationalPodcast:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate conversational podcast');
  }
} 