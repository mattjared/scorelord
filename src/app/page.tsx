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
  // filter out sports that don't have yesterday scores or today schedule
  const filteredSportsData = sportsData.filter(sport => (sport.data.yesterdayScores && sport.data.yesterdayScores.length > 0) || (sport.data.todaySchedule && sport.data.todaySchedule.length > 0));
  return (
    <div className="pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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

      {filteredSportsData.map((sport, index) => (
        <div key={index} className="mb-12">
          <div className="">
            <h2 className="text-4xl mb-2 font-black text-teal-500 col-span-2" id={sport.sport}>{sport.sport}</h2>
            <div className="col-span-5">
              <h3 className="font-bold text-lg mb-2">Yesterday&apos;s {sport.sport} Scores</h3>
              {sport.data.yesterdayScores && sport.data.yesterdayScores.length > 0 ? (
                sport.data.yesterdayScores.map((game, gameIndex) => (
                  <div key={gameIndex} className="py-1 rounded text-slate-300 font-light text-sm antialiased">
                  <span>
                    {game.home_team} {game.scores?.find(s => s.name === game.home_team)?.score} -&nbsp; 
                    {game.scores?.find(s => s.name === game.away_team)?.score} {game.away_team}
                  </span>
                </div>
                ))
              ) : (
                <p className="text-slate-300 font-light text-sm">No scores available</p>
              )}
            </div>
            <div className="col-span-5">
              <h3 className="font-bold text-lg mb-2">Today&apos;s Games</h3>
              {sport.data.todaySchedule && sport.data.todaySchedule.length > 0 ? (
                sport.data.todaySchedule.map((game, gameIndex) => (
                  <div key={gameIndex} className="py-1 rounded text-slate-300 font-light text-sm antialiased">
                    <span>
                      {game.home_team} vs {game.away_team}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-300 font-light text-sm">No games scheduled for today</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
