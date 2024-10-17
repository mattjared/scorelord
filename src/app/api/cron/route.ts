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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Cron job result:', result);

    return NextResponse.json({ success: true, message: 'Cron job completed successfully' });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
