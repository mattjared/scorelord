import { NextResponse } from 'next/server';
import { sports } from '@/app/utils/sports';
import { supabase } from '@/app/utils/supabase';

// force dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Fetching schedule from supabase');
    // Get today's date in Eastern Time (YYYY-MM-DD format)
    const todayET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const todayDateString = new Date(todayET).toISOString();
    
    console.log('🔍 Looking for games on date:', todayDateString);
    
    // only get games for today for the sports in the sports array
    const allSchedules = await Promise.all(
      sports.map(async (sport: { key: string; name: string }) => {
        // get any future games for the sport
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('sport_key', sport.key)
          .gte('commence_time', todayDateString)
          .eq('completed', false)
          .order('commence_time', { ascending: true })
        if (error) {
          console.error(`Error fetching ${sport.name} games:`, error);
        }
        console.log(`🏀 ${sport.name} (${sport.key}): ${data?.length || 0} games found`);
        
        return { sport: sport.name, games: data || [] };
      })
    );

    return NextResponse.json(allSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

