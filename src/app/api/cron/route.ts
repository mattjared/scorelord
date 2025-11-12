import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Cron job triggered at:', new Date().toISOString());

  try {
    // set scores
    const setScoresResponse = await fetch(`${process.env.BASE_URL}/api/setScores`);
    const setScoresResponseData = await setScoresResponse.json();
    console.log('Set scores response:', setScoresResponseData);

    // set schedules
    const summonResponse = await fetch(`${process.env.BASE_URL}/api/summon`);
    const summonResponseData = await summonResponse.json();
    console.log('Summon response:', summonResponseData);

    return NextResponse.json({ success: true, message: 'Cron job executed successfully' });
  } catch (error) {
    console.error('Caught error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
