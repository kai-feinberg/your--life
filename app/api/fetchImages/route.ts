// route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// Store your Getty Images API key securely in environment variables
const GETTY_API_KEY = process.env.GETTY_IMAGES_API_KEY;

export async function GET(req: Request) {
  try {
    // Retrieve the name from query parameters
    const url = new URL(req.url);
    const userName = url.searchParams.get('name');

    if (!userName) {
      return NextResponse.json({ error: 'User name is required' }, { status: 400 });
    }

    // Define headings based on the user's inputted name
    const headings = [
      `${userName}`,
      `${userName} family`,
      `${userName} history`,
    ];

    // Fetch images for each heading from Getty Images
    const imageSectionsPromises = headings.map(async (heading) => {
      const response = await axios.get(`https://api.gettyimages.com/v3/search/images`, {
        params: {
          phrase: heading,
          page_size: 3, // Fetch three images per heading
          minimum_size: "large",
         // content_type: "photography", // Ensure quality by limiting to photography
          
        },
        headers: {
          'Api-Key': GETTY_API_KEY,
        },
      });

      const images = response.data.images;
      // Return an array of image URLs for this heading
      return images.map((image: any) => image.display_sizes[0].uri);
    });

    // Resolve all promises for image fetching
    const imageSections = await Promise.all(imageSectionsPromises);

    // Prepare the response data
    const result = {
      userName,
      headings,
      imageSections,
    };

    // Return the response with user name, headings, and images
    return NextResponse.json({ data: result }, { status: 200 });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}


/* // route.ts (image fetching)
import { NextResponse } from 'next/server';
import axios from 'axios';
import { OpenAI } from 'openai';

const GETTY_API_KEY = process.env.GETTY_IMAGES_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function fetchKeyEvents(userName: string): Promise<string[]> {
  const prompt = `List three famous events commonly associated with ${userName}. Please keep each event as a short, distinct heading.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });

    const generatedText = response.choices[0]?.message?.content;
    if (!generatedText) throw new Error('No events generated');

    const events = generatedText.split('\n').filter(Boolean);
    return events.slice(0, 3);

  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get('name');

    if (!userName) {
      return NextResponse.json({ error: 'User name is required' }, { status: 400 });
    }

    const keyEvents = await fetchKeyEvents(userName);
    if (keyEvents.length === 0) {
      return NextResponse.json({ error: 'Unable to fetch key events' }, { status: 500 });
    }

    const headings = [
      `${userName} adult`,
      `${userName} family`,
      ...keyEvents,
    ];

    const imageSectionsPromises = headings.map(async (heading) => {
      const response = await axios.get(`https://api.gettyimages.com/v3/search/images`, {
        params: {
          phrase: heading,
          page_size: 3, // Fetch only the top image for each heading
          minimum_size: "large",
        },
        headers: {
          'Api-Key': GETTY_API_KEY,
        },
      });

      const images = response.data.images;
      // Return an array with the top image URL if available, or an empty array if not
      return images.length > 0 ? [images[0].display_sizes[0].uri] : [];
    });

    // Resolve all promises for image fetching
    const imageSections = await Promise.all(imageSectionsPromises);

    const result = {
      userName,
      headings,
      imageSections,
    };

    // Return the response with user name, headings, and images
    return NextResponse.json({ data: result }, { status: 200 });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}
 */