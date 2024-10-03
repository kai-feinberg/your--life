//uses open ai's api to create a script based off of a promp

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
 
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ data: "just a test script " }, { status: 200 });
  } catch (error) {
    console.error('Error creating script:', error);
    return NextResponse.json({ error: 'Error ' }, { status: 500 });
  }
}
