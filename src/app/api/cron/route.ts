import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Cron job triggered at:', new Date().toISOString());

  try {
    const url = `https://scorelord.vercel.app/api/runscorelord`;
    console.log('Attempting to fetch:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Cron job triggered' }),
      // Add a timeout to prevent the request from hanging indefinitely
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to send Slack message: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);

    return NextResponse.json({ success: true, message: 'Cron job executed successfully' });
  } catch (error) {
    console.error('Caught error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
