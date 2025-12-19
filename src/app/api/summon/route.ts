import { NextResponse } from 'next/server';
// import { Game } from '@/app/types';
import { sports } from '@/app/utils/sports';
import { supabase } from '@/app/utils/supabase';
import { Game } from '@/app/types';
// force dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Summoning daily scrolls');
  try {
    // Get today's schedule from API and store it in the database
    const allSchedules = await Promise.all(
      sports.map(async (sport) => {
        // get todays date in ISO format
        const todaysDate = new Date().toISOString();
        const cleanTomorrowTime = new Date(new Date(todaysDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z';
        const url = `${process.env.API_BASE_URL}/${sport.key}/events?apiKey=${process.env.ODDS_API_KEY}?commenceTimeTo=${cleanTomorrowTime}`;
        // example odds api url: https://api.the-odds-api.com/v4/sports/baseball_mlb/events/?apiKey=1234567890
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${sport.name}:`, response.status);
          return [];
        }
        const data = await response.json();
        
        // Transform API data to match database schema
        return data.map((game: Game) => ({
          game_id: game.id,
          sport_key: game.sport_key,
          sport_name: sport.name,              // Map to sport_name (not sport_title)
          commence_time: game.commence_time,
          home_team: game.home_team,
          away_team: game.away_team,
          home_score: null,
          away_score: null,
          completed: false,
        }));
      })
    );
    
    const allGames = allSchedules.flat();
    
    if (allGames.length === 0) {
      return NextResponse.json({ message: 'No games scheduled for today' }, { status: 200 });
    }
    
    // Use UPSERT to avoid duplicates if this runs multiple times
    const { data, error } = await supabase
      .from('games')
      .upsert(allGames, { onConflict: 'game_id' })
      .select();
    
    if (error) {
      console.error('Error storing schedule:', error);
      return NextResponse.json({ error: 'Failed to store schedule', details: error }, { status: 500 });
    }
    
    console.log(`✅ Successfully stored ${data?.length || 0} games`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Schedule stored successfully',
      gamesStored: data?.length || 0,
    }, { status: 200 });
  } catch (error) {
    console.error('Error storing schedule:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to store schedule',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}