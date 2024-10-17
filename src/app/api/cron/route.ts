import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
export async function GET() {
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
    return NextResponse.json({ success: true, message: 'Cron job executed successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}