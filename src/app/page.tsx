import { SportData, GameScore } from '@/app/types';

async function getSportsData(): Promise<SportData[]> {
  const res = await fetch(`${process.env.BASE_URL}/api/sports?sport=all`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch sports data');
  return res.json();
}
export default async function Home() {
  const sportsData = await getSportsData();
  return (
    <div className="min-h-screen  text-green-400 p-8 font-mono max-w-screen-lg mx-auto">
      <h1 className="text-4xl mb-8 text-center">Sports Scoreboard</h1>
      <form action="/api/runscorelord" method="post">
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
        >
          Send Sample Data to Slack
        </button>
      </form>
      
      {sportsData.map((sport: SportData, index: number) => (
        <div key={index} className="mb-12">
          <h2 className="text-3xl mb-4">{sport.sport}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl mb-4">Yesterday&apos;s {sport.sport} Scores</h3>
              {sport.data.yesterdayScores && sport.data.yesterdayScores.length > 0 ? (
                sport.data.yesterdayScores.map((game: GameScore, gameIndex: number) => (
                  <div key={gameIndex} className="p-4 rounded text-slate-400">
                  <span>
                    {game.home_team} {game.scores.find(s => s.name === game.home_team)?.score} - 
                    {game.scores.find(s => s.name === game.away_team)?.score} {game.away_team}
                  </span>
                </div>
                ))
              ) : (
                <p>No scores available</p>
              )}
            </div>
            <div>
              <h3 className="text-2xl mb-4">Today&apos;s Games</h3>
              {sport.data.todaySchedule && sport.data.todaySchedule.length > 0 ? (
                sport.data.todaySchedule.map((game: GameScore, gameIndex: number) => (
                  <div key={gameIndex} className="p-4 rounded text-slate-400">
                    <span>
                      {game.home_team} vs {game.away_team}
                    </span>
                  </div>
                ))
              ) : (
                <p>No games scheduled for today</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
