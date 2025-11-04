export interface SportData {
  sport: string;
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