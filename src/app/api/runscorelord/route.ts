import { NextResponse } from 'next/server';

interface SportData {
  sport: string;
  data: {
    yesterdayScores: GameScore[];
    todaySchedule: GameScore[];
  };
}

interface GameScore {
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }>;
  completed: boolean;
}

async function fetchSportsData(sport: string) {
  const apiUrl = `${process.env.BASE_URL}/api/sports?sport=${sport}`;
  console.log('Fetching sports data from:', apiUrl);
  
  const response = await fetch(apiUrl, { 
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('Response status:', response.status);

  const responseBody = await response.text();
  console.log('Response body:', responseBody);

  if (!response.ok) {
    throw new Error(`Failed to fetch sports data: ${response.status}. Body: ${responseBody}`);
  }

  try {
    return JSON.parse(responseBody);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error(`Failed to parse response as JSON. Body: ${responseBody}`);
  }
}

async function sendToSlack(message: string) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    throw new Error('Slack webhook URL is not configured');
  }
  
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message to Slack: ${response.status}`);
  }

  return response.text();
}

export async function POST() {
  try {
    console.log('Fetching data...');
    const sportsData: SportData[] = await fetchSportsData('all');
    const date = new Date().toLocaleDateString();
    
    let message = `Sports Update: ${date}\n\n`;

    sportsData.forEach((sportData) => {
      const { sport, data } = sportData;
      if (data.yesterdayScores.length > 0) {
        message += `🪄 Yesterday's ${sport} Scores:\n`;
        data.yesterdayScores.forEach((game) => {
          const homeScore = game.scores.find(s => s.name === game.home_team)?.score;
          const awayScore = game.scores.find(s => s.name === game.away_team)?.score;
          message += `${game.home_team} ${homeScore} - ${awayScore} ${game.away_team}\n`;
        });
        message += '\n';
      }

      if (data.todaySchedule.length > 0) {
        message += `🔮 Today's ${sport} Schedule:\n`;
        data.todaySchedule.forEach((game) => {
          const homeScore = game.scores.find(s => s.name === game.home_team)?.score;
          const awayScore = game.scores.find(s => s.name === game.away_team)?.score;
          const scoreInfo = game.completed ? `${homeScore} - ${awayScore}` : 'vs';
          message += `${game.home_team} ${scoreInfo} ${game.away_team}\n`;
        });
        message += '\n';
      }
    });

    if (message === `🔮 Scorelord here for the update for today: ${date}\n\n`) {
      message += 'No scores or schedules available for any sport.';
    }

    await sendToSlack(message.trim());
    
    return NextResponse.json({ success: true, message: 'Message sent to Slack' });
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
