import { NextResponse } from 'next/server';
import { Game } from '@/app/types';
import { sports } from '@/app/lib/sports';

export const dynamic = 'force-dynamic';
// Example API call: http://localhost:3000/api/schedule
// Production API call: https://scorelord.vercel.app/api/schedule

export async function GET() {
  try {
    // Get today's date in Eastern Time
    const allSchedules = await Promise.all(
      sports.map(async (sport) => {
        const url = `${process.env.API_BASE_URL}/${sport.key}/events?apiKey=${process.env.ODDS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${sport.name}:`, response.status);
          return { sport: sport.name, events: [] };
        }
        const data = await response.json() as Game[];
        // Change ISO 8601 to date
        data.forEach(game => {
          game.commence_time = new Date(game.commence_time).toLocaleString('en-US', { timeZone: 'America/New_York' });
        });
        // Filter out games that are not today
        const filteredData = data.filter(game => {
          return new Date(game.commence_time).toLocaleDateString() === new Date().toLocaleDateString();
        });
        return { sport: sport.name, games: filteredData };
      })
    );
    
    return NextResponse.json(allSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}