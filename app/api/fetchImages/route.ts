//route.ts
//uses gettyimagesapi to retrieve images related to the headings 

import { NextResponse } from 'next/server';
import axios from 'axios';

// Store your Getty Images API key securely in environment variables
const GETTY_API_KEY = process.env.GETTY_IMAGES_API_KEY;
const GETTY_API_SECRET = process.env.GETTY_IMAGES_API_SECRET;

export async function GET(req: Request) {
  try {
    // Dummy test script with headings
    const script = `
      # Steph Curry 1992
      Stephen Curry was born in Akron, Ohio, in 1992...

      # Steph Curry Davidson
      Curry played high school basketball in Charlotte...

      # Stephen CUrry Warriors
      At Davidson College, Curry became a household name...
    `;

    // Extract headings from the script (assuming they start with #)
    const headings = script.match(/#(.*)/g)?.map((heading) => heading.replace("#", "").trim());

    if (!headings || headings.length === 0) {
      return NextResponse.json({ error: 'No headings found in the script' }, { status: 400 });
    }

    // Fetch images for each heading from Getty Images
    const imagePromises = headings.map(async (heading) => {
      const response = await axios.get(`https://api.gettyimages.com/v3/search/images`, {
        params: {
          phrase: heading,
          page_size: 1, // Fetch one image per heading
        },
        headers: {
          'Api-Key': GETTY_API_KEY,
        },
      });
      
      const images = response.data.images;
      // Return the first image URL if available
      return images.length > 0 ? images[0].display_sizes[0].uri : null;
    });

    // Resolve all promises for image fetching
    const images = await Promise.all(imagePromises);

    // Filter out any null images (in case no results are found for some headings)
    const filteredImages = images.filter((image) => image !== null);

    // Prepare the response data
    const result = {
      script: script,
      headings: headings,
      images: filteredImages,
    };

    // Return the response with script and images
    return NextResponse.json({ data: result }, { status: 200 });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}


// We can search images by year... For example (Beginning: (Person or Event Age + 20 Years), Middle: (Person or event age + 40 years), End: (Person or Event: 2024))