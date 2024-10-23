//Generate Audio -> route.ts

import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Function to split text into smaller sections
function parseTextByHeadings(text) {
  return text.split(/(?:^|\n)(?=#)/g);
}

export async function POST(req) {
  try {
    const { text, languageCode = 'en-US', voiceName = 'en-US-Studio-Q' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const client = new TextToSpeechClient();
    const sections = parseTextByHeadings(text); // Split the script into sections
    const audioContents = [];

    // Generate audio for each section
    for (const section of sections) {
      const request = {
        input: { text: section },
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await client.synthesizeSpeech(request);
      audioContents.push(Buffer.from(response.audioContent).toString('base64')); // Convert to base64
    }

    return NextResponse.json({ audioContents }); // Return the audio data
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
