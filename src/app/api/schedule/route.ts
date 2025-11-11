import { NextResponse } from 'next/server';
import { sports } from '@/app/lib/sports';
import { supabase } from '@/app/lib/supabase';

// force dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Fetching schedule from supabase');
    // Get today's date in Eastern Time (YYYY-MM-DD format)
    const todayET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const todayDateString = todayET.toISOString().split('T')[0];
    
    console.log('🔍 Looking for games on date:', todayDateString);
    
    // only get games for today for the sports in the sports array
    const allSchedules = await Promise.all(
      sports.map(async (sport: { key: string; name: string }) => {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('sport_key', sport.key)
          .eq('game_date', todayDateString)
          .eq('completed', false)
          .order('commence_time', { ascending: true })
        if (error) {
          console.error(`Error fetching ${sport.name} games:`, error);
        }
        console.log(`🏀 ${sport.name} (${sport.key}): ${data?.length || 0} games found`);
        
        return { sport: sport.name, games: data || [] };
      })
    );
    
    // Filter out sports with no games
    // const filteredSchedules = allSchedules.filter(schedule => schedule.games.length > 0);
    //
    
    
    return NextResponse.json(allSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

