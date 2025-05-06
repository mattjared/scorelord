const API_KEY = process.env.ODDS_API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

export const sports = [
  { key: 'icehockey_nhl', name: 'NHL', icon: "🏒"},
  { key: 'basketball_nba', name: 'NBA', icon: "🏀"},
  { key: 'americanfootball_nfl', name: 'NFL', icon: "🏈"},
  { key: 'baseball_mlb', name: 'MLB', icon: "⚾️"},
  { key: 'soccer_epl', name: 'EPL', icon: "⚽️"},
  { key: 'soccer_usa_mls', name: 'MLS', icon: "⚽️"},
  { key: 'basketball_wncaab', name: 'NCAAW', icon: "🏀"},
  { key: 'basketball_ncaab', name: 'NCAAM', icon: "🏀"},
  { key: 'basketball_wnba', name: 'WNBA', icon: "🏀"},
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

export async function fetchSportData(sportKey: string): Promise<{
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

  console.log(data);

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