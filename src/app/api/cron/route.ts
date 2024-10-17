import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  console.log('Cron job started at:', new Date().toISOString());

  try {
    await delay(5000);
    console.log('Delay before request completed at:', new Date().toISOString());

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

    await delay(5000);
    console.log('Delay after request completed at:', new Date().toISOString());

    return NextResponse.json({ success: true, message: 'Cron job executed successfully' });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ success: false, error: 'Cron job failed' }, { status: 500 });
  }
}
