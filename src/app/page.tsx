import { Card, CardContent } from '@/components/ui/card';
import { Game } from './types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const scheduleData = await fetch(`${process.env.BASE_URL}/api/today`).then(res => res.json());
  console.log(scheduleData);
  return (
    <div className="pb-8">
      <h3 className="text-2xl font-bold text-green-300 mb-4">Upcoming Games</h3>
      <div className="grid grid-cols-4 gap-6 text-green-200">
        {scheduleData.map((sport: { sport: string; games: Game[] }) => (
          sport.games.length > 0 ? (
          <div key={sport.sport} className="p-3 rounded-lg space-y-2 text-xs text-green-200 mb-4">
            <h3 className="text-lg font-bold text-purple-400 mb-2">{sport.sport}</h3>
            {sport.games.map((game: Game, gameIndex: number) => (
              <Card key={gameIndex} className="text-xsm mb-4 border-green-400/20 bg-gray-800 p-2">
                <CardContent className="p-0">
                  <p className="text-xs text-green-200">{game.away_team} @</p> 
                  <p className="text-xs text-green-400">{game.home_team}</p> 
                  <p className="text-xs text-green-600">{new Date(game.commence_time).toLocaleTimeString('en-US', { timeZone: 'America/New_York', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          ) : null
        ))}
      </div>
    </div>
  );
}
