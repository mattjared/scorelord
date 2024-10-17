export default function Home() {
  // call to /api/sports/scores?sport=NHL
  // call to /api/sports/scores?sport=MLB
  // call to /api/sports/scores?sport=NBA
  // call to /api/sports/scores?sport=NFL
  
  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <h1 className="text-4xl mb-8 text-center">Sports Scoreboard</h1>
      <form action="/api/runscorelord" method="post">
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Sample Data to Slack
        </button>
      </form>
      <div className="flex justify-center space-x-4 mb-8">
        {Object.keys(sportsData).map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded ${
              selectedSport === sport ? 'bg-green-400 text-black' : 'bg-gray-800'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mb-4">Yesterday's Scores</h2>
          <ul className="space-y-2">
            {sportsData[selectedSport].yesterday.map((game, index) => (
              <li key={index} className="bg-gray-900 p-4 rounded">
                <span>{game.teams}</span>
                <span className="float-right">{game.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mb-4">Today's Games</h2>
          <ul className="space-y-2">
            {sportsData[selectedSport].today.map((game, index) => (
              <li key={index} className="bg-gray-900 p-4 rounded">
                <span>{game.teams}</span>
                <span className="float-right">{game.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}