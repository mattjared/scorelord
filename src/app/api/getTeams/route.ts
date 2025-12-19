import { sports } from "@/app/utils/sports";
import { Team } from "@/app/types";
import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

export async function GET() {
  try {
    const allTeams = await Promise.all(
      sports.map(async (sport) => {
        const response = await fetch(`${process.env.API_BASE_URL}/${sport.key}/participants?apiKey=${process.env.ODDS_API_KEY}`);
        const data = await response.json() as Team[];
        return data.map((team: Team) => ({
          ...team,
          sport_key: sport.key,
          sport_title: sport.name,
        }));
      })
    );
    const flattenedTeams = allTeams.flat() as Team[];
    // save teams to supabase
    const { data, error } = await supabase.from('teams').upsert(flattenedTeams, { onConflict: 'id' });
    if (error) {
      console.error('Error saving teams to supabase:', error);
    }
    console.log('Teams saved to supabase:', data);
    return NextResponse.json(flattenedTeams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}