import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Cron job started at:', new Date().toISOString());

  try {
    const url = `${process.env.BASE_URL}/api/runscorelord`;
    console.log('Attempting to call:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    const result = await response.json();
    console.log('Cron job result:', result);

    return NextResponse.json({ success: true, message: 'Cron job completed successfully' });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
