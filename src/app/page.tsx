import { sports } from '@/app/lib/sports';
import { fetchSportData } from '@/app/lib/sports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export const dynamic = 'force-dynamic';

export default async function Home() {
  const sportsData = await Promise.all(
    sports.map(async (s) => ({
      sport: s.name,
      icon: s.icon,
      data: await fetchSportData(s.key)
    }))
  );

  // filter out sports that don't have yesterday scores or today schedule
  const filteredSportsData = sportsData.filter(sport => (sport.data.yesterdayScores && sport.data.yesterdayScores.length > 0) || (sport.data.todaySchedule && sport.data.todaySchedule.length > 0));
  return (
    <div className="pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <Card key={index} className="border-green-400/20 bg-gray-800 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-5  bg-gray-700 border-b border-green-400/20">
            <CardTitle className="text-2xl font-bold text-green-300 flex items-center gap-2" id={sport.sport}>{sport.icon} {sport.sport}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="w-full mt-4 mb-12 rounded-lg">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="today" className="data-[state=active]:bg-gray-800 data-[state=active]:text-purple-400">Today</TabsTrigger>
                <TabsTrigger value="yesterday" className="data-[state=active]:bg-gray-800 data-[state=active]:text-purple-400">Yesterday</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="mt-4 rounded-lg">  
                <ScrollArea className="h-[500px]">
                  <div>
                    {sport.data.todaySchedule && sport.data.todaySchedule.length > 0 ? (
                      sport.data.todaySchedule.map((game, gameIndex) => (
                        <div key={gameIndex} className="bg-gray-700/50 p-3 rounded-lg space-y-2 text-sm text-green-200 mb-4">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.home_team}</div>
                          </div>
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.away_team}</div>
                          </div>
                      </div>
                      ))
                    ) : (
                      <p className="text-slate-300 font-light text-sm">No scores available</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="yesterday" className="mt-4 rounded-lg">
                <ScrollArea className="h-[500px]">
                  <div>
                    {sport.data.yesterdayScores && sport.data.yesterdayScores.length > 0 ? (
                      sport.data.yesterdayScores.map((game, gameIndex) => (
                        <div key={gameIndex} className="bg-gray-700/50 p-3 rounded-lg space-y-2 text-sm text-green-200 mb-4">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.home_team}</div>
                            <div className="col-span-2 text-right text-purple-400 font-bold">{game.scores?.find(s => s.name === game.home_team)?.score}</div>
                          </div>
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.away_team}</div>
                            <div className="col-span-2 text-right text-purple-400 font-bold">{game.scores?.find(s => s.name === game.away_team)?.score}</div>
                          </div>
                      </div>
                      ))
                    ) : (
                      <p className="text-slate-300 font-light text-sm">No scores available</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
