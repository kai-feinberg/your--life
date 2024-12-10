import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';

// Function to clean text by removing lines starting with #
function cleanText(text) {
  return text
    .split('\n') // Split text into lines
    .filter((line) => !line.trim().startsWith('#')) // Remove lines starting with #
    .join('\n'); // Rejoin the remaining lines
}

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
    
    const textToSpeechClient = new TextToSpeechClient();
    const storageClient = new Storage();
    const bucketName = 'your-life-bucker'; // Replace with your bucket name
    const sections = parseTextByHeadings(text);
    const audioUrls = [];

    // Generate audio for each section and upload to Google Cloud Storage
    for (let i = 0; i < sections.length; i++) {
      const request = {
        input: { text: sections[i] },
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await textToSpeechClient.synthesizeSpeech(request);
      
      // Generate a unique filename
      const filename = `audio_section_${Date.now()}_${i}.mp3`;
      
      // Create a file in the bucket
      const file = storageClient.bucket(bucketName).file(filename);
      
      // Upload the audio content
      await file.save(response.audioContent, {
        metadata: { 
          contentType: 'audio/mpeg' 
        }
      });

      // Store the public URL (if needed, you can generate a signed URL instead)
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      audioUrls.push(publicUrl);
    }

    return NextResponse.json({ 
      message: 'Audio files generated and stored successfully', 
      audioUrls 
    });
  } catch (error) {
    console.error('Error generating and storing speech:', error);
    return NextResponse.json({ error: 'Failed to generate and store speech' }, { status: 500 });
  }
}