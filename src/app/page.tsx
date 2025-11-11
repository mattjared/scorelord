import { Card, CardContent } from '@/components/ui/card';
import { Game } from './types';
import { convertTzReturnDateOnly, todaysDate } from './lib/convert-tz';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const scheduleData = await fetch(`${process.env.BASE_URL}/api/schedule`).then(res => res.json());
  // filter sport.games.length > 0 and convertTzReturnDateOnly(game.commence_time) === todaysDate
  const dataToShow = scheduleData.filter((sport: { sport: string; games: Game[] }) => sport.games.length > 0 && sport.games.filter((game: Game) => convertTzReturnDateOnly(game.commence_time) === todaysDate).length > 0);
  return (
    <div className="pb-8">
      <h3 className="text-2xl font-bold text-green-300 mb-4">Today&apos;s Games</h3>
      <div className="grid grid-cols-4 gap-6 text-green-200">
        {dataToShow.map((sport: { sport: string; games: Game[] }) => (
          <div key={sport.sport} className="p-3 rounded-lg space-y-2 text-sm text-green-200 mb-4">
            <h3 className="text-lg font-bold text-green-300 mb-2">{sport.sport}</h3>
            {sport.games.map((game: Game, gameIndex: number) => (
              <Card key={gameIndex} className="text-sm mb-4 border-green-400/20 bg-gray-800">
                <CardContent className="p-0">
                  <p className="text-sm text-green-200">{game.home_team} vs {game.away_team} @ {new Date(game.commence_time).toLocaleTimeString('en-US', { timeZone: 'America/New_York', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
