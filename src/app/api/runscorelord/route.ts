import { NextResponse } from 'next/server';
import { SportData } from '@/app/types';
import { fetchSportsData } from '@/app/lib';
import { sendToSlack } from '@/app/lib';

export const dynamic = 'force-dynamic';
export async function POST() {
  console.log('sendSlackTestMessage endpoint called at:', new Date().toISOString());
  try {
    console.log('Fetching data...');
    const sportsData: SportData[] = await fetchSportsData('all');
    const date = new Date().toLocaleDateString();
    
    let message = `Today's Update: ${date}\n\n`;

    if (!sportsData) {
      throw new Error('Invalid or missing data structure');
    }
    console.log('sportsData:', sportsData);
    // sportsData.data.yesterdayScores is an array of GameScore objects then loop over the result
    // if sportsData.data.yesterdayScores is not empty then add the message to the message string
    // is sportsData.data.todaySchedule IS EMPTY then skip the sport
    sportsData.forEach((sportData) => {
      const { sport, data } = sportData;
      console.log('Processing data for:', sport);
      console.log('Data:', data);

      // Skip the sport if todaySchedule is empty
      if (data.todaySchedule.length === 0) {
        console.log(`Skipping ${sport} - no games scheduled for today`);
        return; // This is equivalent to 'continue' in a regular for loop
      }

      // Process yesterday's scores
      if (data.yesterdayScores.length > 0) {
        message += `🪄 Yesterday's ${sport} Scores:\n`;
        data.yesterdayScores.forEach((game) => {
          console.log('Processing yesterday\'s scores for:', game);
          const homeScore = game.scores.find(s => s.name === game.home_team)?.score;
          const awayScore = game.scores.find(s => s.name === game.away_team)?.score;
          message += `${game.home_team} ${homeScore} - ${awayScore} ${game.away_team}\n`;
        });
        message += '\n';
      }

      // Process today's schedule
      message += `🔮 Today's ${sport} Schedule:\n`;
      data.todaySchedule.forEach((game) => {
        console.log('Processing today\'s game:', JSON.stringify(game, null, 2));
        const homeTeam = game.home_team || 'Unknown';
        const awayTeam = game.away_team || 'Unknown';
        message += `${homeTeam} vs ${awayTeam}\n`;
      });
      message += '\n';
    });

    if (message === `🔮 Scorelord here for the update for today: ${date}\n\n`) {
      message += 'No scores or schedules available for any sport.';
    }

    await sendToSlack(message.trim(), "all");

    const sports = ['NBA']; // Add or remove sports as needed
    for (const sport of sports) {
      const sportData = sportsData.find(data => data.sport.toLowerCase() === sport.toLowerCase());
      if (sportData) {
        let message = `${sport.toUpperCase()} Update for: ${date}\n\n`;
        // ... process sportData and build sportMessage ...
        if (sportData.data.yesterdayScores.length > 0) {
          message += `🪄 Yesterday's Scores:\n`;
          sportData.data.yesterdayScores.forEach((game) => {
            const homeScore = game.scores.find(s => s.name === game.home_team)?.score;
            const awayScore = game.scores.find(s => s.name === game.away_team)?.score;
            message += `${game.home_team} ${homeScore} - ${awayScore} ${game.away_team}\n`;
          });
          message += '\n';
        }
        if (sportData.data.todaySchedule.length > 0) {
          message += `🔮 Today's Schedule:\n`;
          sportData.data.todaySchedule.forEach((game) => {
            const homeTeam = game.home_team || 'Unknown';
            const awayTeam = game.away_team || 'Unknown';
            message += `${homeTeam} vs ${awayTeam}\n`;
          });
          message += '\n';
        }
        if (message === `Sports Update for ${sport.toUpperCase()}: ${date}\n\n`) {
          message += 'No scores or schedules available for this sport.';
        }
        try {
          await sendToSlack(message.trim(), sport);
        } catch (error) {
          console.error(`Error sending update for ${sport}:`, error);
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true, message: 'Message sent to Slack' }));
  } catch (error) {
    console.error('Error in POST handler:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
