import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

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
    const sections = parseTextByHeadings(text);
    const audioContents = [];

    for (const section of sections) {
      const request = {
        input: { text: section },
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await client.synthesizeSpeech(request);
      // Convert audio content to base64
      audioContents.push(Buffer.from(response.audioContent).toString('base64'));
    }

    return NextResponse.json({ audioContents });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}