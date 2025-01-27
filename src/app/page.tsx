import { sports } from '@/app/lib/sports';
import { fetchSportData } from '@/app/lib/sports';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const sportsData = await Promise.all(
    sports.map(async (s) => ({
      sport: s.name,
      data: await fetchSportData(s.key)
    }))
  );
  return (
    <div className="pb-8">
      <div className="hidden">
        <form action="/api/runscorelord" method="post">
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
          >
            Send Sample Data to Slack
          </button>
        </form>
      </div>

      {sportsData.map((sport, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-3xl mb-2 font-black text-teal-500" id={sport.sport}>{sport.sport}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl mb-4">Yesterday&apos;s {sport.sport} Scores</h3>
              {sport.data.yesterdayScores && sport.data.yesterdayScores.length > 0 ? (
                sport.data.yesterdayScores.map((game, gameIndex) => (
                  <div key={gameIndex} className="py-2 rounded text-slate-300 font-light">
                  <span>
                    {game.home_team} {game.scores?.find(s => s.name === game.home_team)?.score} -&nbsp; 
                    {game.scores?.find(s => s.name === game.away_team)?.score} {game.away_team}
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
                sport.data.todaySchedule.map((game, gameIndex) => (
                  <div key={gameIndex} className="py-2 rounded text-slate-300">
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
