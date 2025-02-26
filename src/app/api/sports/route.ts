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
      // filter out any sports that have no games today or yesterday
      const filteredData = allData.filter(sport => sport.data.yesterdayScores.length > 0 || sport.data.todaySchedule.length > 0);
      return NextResponse.json(filteredData);
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
    });
  } catch (error) {
    console.error(`Error fetching data for ${sport}:`, error);
    return NextResponse.json({ error: 'Failed to fetch sport data' }, { status: 500 });
  }
}