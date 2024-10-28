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
      `${userName} young`,
      `${userName} adult`,
      `${userName} 2024`,
    ];

    // Fetch images for each heading from Getty Images
    const imageSectionsPromises = headings.map(async (heading) => {
      const response = await axios.get(`https://api.gettyimages.com/v3/search/images`, {
        params: {
          phrase: heading,
          page_size: 3, // Fetch three images per heading
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
