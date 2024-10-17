export interface SportData {
  sport: string;
  data: {
    yesterdayScores: GameScore[];
    todaySchedule: GameScore[];
  };
}

export interface GameScore {
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }>;
  completed: boolean;
}