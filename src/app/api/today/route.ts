// an api endpoint that returns the todays games
import { sports } from "@/app/utils/sports";
import { NextResponse } from "next/server";

// force dynamic
export const dynamic = 'force-dynamic';

export async function GET() {

  try {
    // loop through the sports array and fetch the events for each sport
    const allEvents = await Promise.all(
      sports.map(async (sport) => {
        const url = `https://api.the-odds-api.com/v4/sports/${sport.key}/events?apiKey=${process.env.ODDS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${sport.name}:`, response.status);
          return [];
        }
        const data = await response.json();
        return { sport: sport.name, games: data || [] };
      })
    );
    return NextResponse.json(allEvents);
  } catch (error) {
    console.error('Error fetching today\'s games:', error);
    return NextResponse.json({ error: 'Failed to fetch today\'s games' }, { status: 500 });
  }
}