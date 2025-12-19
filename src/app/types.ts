export interface SportData {
  sport_key: string;
  sport_title: string;
  data: {
    yesterdayGames: Game[];
    todayGames: Game[];
  };
}

export interface Game {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }>;
}

export interface Team {
  id: string;
  full_name: string;
  sport_key: string;
  sport_title: string;
  wikipedia_slug: string;
  reddit_slug: string;
  twitter_slug: string;
  instagram_slug: string;
  youtube_slug: string;
  tiktok_slug: string;
  twitch_slug: string;
  discord_slug: string;
  website_url: string;
  city: string;
  state: string;
  country: string;
  logo: string;
  color_primary: string;
  color_secondary: string;
  color_text: string;
  active: boolean;
  type: string;
  sub_type: string;
  description: string;
  founded: number;
  updated: string;
  leagues: LeagueData[];
  stadium: StadiumData;
  current_season: SeasonData;
}
export interface SeasonData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  current_week: number;
  week_number: number;
  record_wins: number;
  record_losses: number;
  record_ties: number;
  points: number;
  goals_diff: number;
  standing: number;
}

export interface StadiumData {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image: string;
}

export interface LeagueData {
  id: string;
  name: string;
  slug: string;
  logo: string;
  type: string;
  sub_type: string;
  description: string;
  founded: number;
  updated: string;
  teams: Team[];
  games: Game[];
} 