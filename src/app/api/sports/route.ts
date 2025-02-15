import { NextResponse } from 'next/server';
import { Sport } from '@/app/lib/sports';
import { fetchSportData } from '@/app/lib/sports';
import { sports } from '@/app/lib/sports';

export const dynamic = 'force-dynamic';
// Example API call: http://localhost:3000/api/sports?sport=all
// Production API call: https://scorelord.vercel.app/api/sports?sport=all

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport') as Sport | 'all' | null;
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  
  if (!sport) {
    return NextResponse.json({ error: 'Sport parameter is required' }, { status: 400 });
  }

  if (sport === 'all') {
    try {
      const allData = await Promise.all(
        sports.map(async (s) => ({
          sport: s.name,
          data: await fetchSportData(s.key)
        }))
      );
      return NextResponse.json(allData);
    } catch (error) {
      console.error('Error fetching all sports:', error);
      return NextResponse.json({ error: 'Failed to fetch sports data' }, { status: 500 });
    }
  }

  const sportData = sports.find(s => s.name === sport);
  if (!sportData) {
    return NextResponse.json({ error: 'Invalid sport specified' }, { status: 400 });
  }

  try {
    const { yesterdayScores, todaySchedule } = await fetchSportData(sportData.key);
    return NextResponse.json({ 
      sport: sportData.name, 
      yesterdayScores, 
      todaySchedule 
    }, { headers });
  } catch (error) {
    console.error(`Error fetching data for ${sport}:`, error);
    return NextResponse.json({ error: 'Failed to fetch sport data' }, { status: 500 });
  }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}