import { NextResponse } from 'next/server';

const API_KEY = process.env.ODDS_API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

const sports = [
  { key: 'icehockey_nhl', name: 'NHL' },
  { key: 'basketball_nba', name: 'NBA' },
  { key: 'americanfootball_nfl', name: 'NFL' },
  { key: 'baseball_mlb', name: 'MLB' },
  { key: 'soccer_epl', name: 'EPL' }
] as const;

export type Sport = (typeof sports)[number]['name'];

interface Score {
  name: string;
  score: string;
}

interface GameScore {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Score[] | null;
  last_update: string | null;
}

function getETDate(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

async function fetchSportData(sportKey: string): Promise<{
  yesterdayScores: GameScore[];
  todaySchedule: GameScore[];
}> {
  const url = `${API_BASE_URL}/${sportKey}/scores/?apiKey=${API_KEY}&daysFrom=2`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json() as GameScore[];

  const nowET = getETDate(new Date());
  const yesterdayET = getETDate(new Date(nowET));
  yesterdayET.setDate(yesterdayET.getDate() - 1);

  const yesterdayScores = data.filter(game => {
    const gameDate = getETDate(new Date(game.commence_time));
    return isSameDay(gameDate, yesterdayET) && game.completed;
  });

  const todaySchedule = data.filter(game => {
    const gameDate = getETDate(new Date(game.commence_time));
    return isSameDay(gameDate, nowET);
  });

  return {
    yesterdayScores,
    todaySchedule
  };
}

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
    });
  } catch (error) {
    console.error(`Error fetching data for ${sport}:`, error);
    return NextResponse.json({ error: 'Failed to fetch sport data' }, { status: 500 });
  }
}
// Example API call: http://localhost:3000/api/sports?sport=all
// Production API call: https://scorelord.vercel.app/api/sports?sport=all
// Baseball API call: https://scorelord.vercel.app/api/sports?sport=baseball_mlb
// local API call: http://localhost:3000/api/sports?sport=baseball_mlb