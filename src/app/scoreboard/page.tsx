"use client"

import * as React from "react"
import { ShoppingBasketIcon as Basketball, ClubIcon as Football, HopIcon as Hockey, Trophy } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Game {
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  homeOdds?: string
  awayOdds?: string
  status?: string
  time?: string
}

interface LeagueData {
  icon: React.ReactNode
  name: string
  yesterdayScores: Game[]
  todayGames: Game[]
}

const leagues: LeagueData[] = [
  {
    icon: <Hockey className="h-5 w-5" />,
    name: "NHL",
    yesterdayScores: [
      { homeTeam: "Winnipeg Jets", awayTeam: "San Jose Sharks", homeScore: 2, awayScore: 1, status: "Final" },
      { homeTeam: "Los Angeles Kings", awayTeam: "Vegas Golden Knights", homeScore: 5, awayScore: 2, status: "Final" },
    ],
    todayGames: [
      {
        homeTeam: "Buffalo Sabres",
        awayTeam: "Anaheim Ducks",
        homeOdds: "+150",
        awayOdds: "-180",
        status: "Live",
        time: "2nd",
        homeScore: 2,
        awayScore: 1,
      },
      {
        homeTeam: "Boston Bruins",
        awayTeam: "Toronto Maple Leafs",
        homeOdds: "-130",
        awayOdds: "+110",
        status: "Upcoming",
        time: "7:00 PM",
      },
      {
        homeTeam: "Washington Capitals",
        awayTeam: "Calgary Flames",
        homeOdds: "+120",
        awayOdds: "-140",
        status: "Upcoming",
        time: "8:00 PM",
      },
      {
        homeTeam: "Montreal Canadiens",
        awayTeam: "Carolina Hurricanes",
        homeOdds: "+200",
        awayOdds: "-240",
        status: "Upcoming",
        time: "7:30 PM",
      },
    ],
  },
  {
    icon: <Basketball className="h-5 w-5" />,
    name: "NBA",
    yesterdayScores: [
      { homeTeam: "Washington Wizards", awayTeam: "Brooklyn Nets", homeScore: 107, awayScore: 99, status: "Final" },
      { homeTeam: "Indiana Pacers", awayTeam: "Denver Nuggets", homeScore: 116, awayScore: 125, status: "Final" },
    ],
    todayGames: [
      {
        homeTeam: "Toronto Raptors",
        awayTeam: "Boston Celtics",
        homeOdds: "+160",
        awayOdds: "-190",
        status: "Live",
        time: "3rd",
        homeScore: 78,
        awayScore: 82,
      },
      {
        homeTeam: "Orlando Magic",
        awayTeam: "Cleveland Cavaliers",
        homeOdds: "+140",
        awayOdds: "-160",
        status: "Upcoming",
        time: "7:30 PM",
      },
      {
        homeTeam: "Houston Rockets",
        awayTeam: "Milwaukee Bucks",
        homeOdds: "+220",
        awayOdds: "-260",
        status: "Upcoming",
        time: "8:00 PM",
      },
    ],
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    name: "EPL",
    yesterdayScores: [],
    todayGames: [
      { homeTeam: "Crystal Palace", awayTeam: "Aston Villa", homeOdds: "+180", awayOdds: "+150" },
      { homeTeam: "Brighton and Hove Albion", awayTeam: "Bournemouth", homeOdds: "-130", awayOdds: "+350" },
      { homeTeam: "Wolverhampton Wanderers", awayTeam: "Fulham", homeOdds: "+120", awayOdds: "+220" },
      { homeTeam: "Chelsea", awayTeam: "Southampton", homeOdds: "-200", awayOdds: "+550" },
    ],
  },
  {
    icon: <Football className="h-5 w-5" />,
    name: "NCAAW",
    yesterdayScores: [],
    todayGames: [
      { homeTeam: "Arizona Wildcats", awayTeam: "Texas Tech Red Raiders", homeOdds: "-150", awayOdds: "+130" },
      { homeTeam: "BYU Cougars", awayTeam: "Kansas Jayhawks", homeOdds: "+110", awayOdds: "-130" },
    ],
  },
]

export default function Scoreboard() {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 max-w-7xl mx-auto font-mono text-green-400">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-300">Sports Scoreboard</h1>
        <div className="text-xl text-green-200">{time.toLocaleTimeString()}</div>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {leagues.map((league) => (
          <Card key={league.name} className="border-green-400/20 bg-gray-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-700 border-b border-green-400/20">
              <CardTitle className="text-xl font-bold text-green-300 flex items-center gap-2">
                {league.icon}
                {league.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="today" className="data-[state=active]:bg-gray-700">
                    Today
                  </TabsTrigger>
                  <TabsTrigger value="yesterday" className="data-[state=active]:bg-gray-700">
                    Yesterday
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="today">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4 p-4">
                      {league.todayGames.map((game, i) => (
                        <div key={i} className="bg-gray-700/50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant={game.status === "Live" ? "destructive" : "secondary"}>{game.status}</Badge>
                            <span className="text-sm text-green-200">{game.time}</span>
                          </div>
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.homeTeam}</div>
                            <div className="col-span-1 text-right text-yellow-300">{game.homeOdds}</div>
                            <div className="col-span-1 text-right text-green-300 font-bold">{game.homeScore}</div>
                          </div>
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.awayTeam}</div>
                            <div className="col-span-1 text-right text-yellow-300">{game.awayOdds}</div>
                            <div className="col-span-1 text-right text-green-300 font-bold">{game.awayScore}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="yesterday">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4 p-4">
                      {league.yesterdayScores.map((game, i) => (
                        <div key={i} className="bg-gray-700/50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{game.status}</Badge>
                          </div>
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.homeTeam}</div>
                            <div className="col-span-2 text-right text-green-300 font-bold">{game.homeScore}</div>
                          </div>
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-3 text-green-200">{game.awayTeam}</div>
                            <div className="col-span-2 text-right text-green-300 font-bold">{game.awayScore}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

