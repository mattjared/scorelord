import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Cron job started at:', new Date().toISOString());

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/runscorelord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Cron job triggered' }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Slack message');
    }

    const result = await response.json();
    console.log('Cron job result:', result);

    return NextResponse.json({ success: true, message: 'Cron job executed successfully' });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ success: false, error: 'Cron job failed' }, { status: 500 });
  }
}
