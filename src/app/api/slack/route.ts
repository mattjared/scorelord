import { NextResponse } from 'next/server';

// interface FormattedSportsData {
//   // Define specific fields based on your data structure
//   sport: string;
//   event: string;
//   date: string;
//   time: string;
//   teams: string[];
//   score?: string;
//   league?: string;
//   start_time?: string;
//   odds?: string[];
//   // Add more fields as needed
// }

// interface SlackBlock {
//   type: 'section';
//   text: {
//     type: 'mrkdwn';
//     text: string;
//   };
// }

// interface SlackMessage {
//   blocks: SlackBlock[];
// }

// async function fetchSportsData(): Promise<FormattedSportsData[]> {
//   const apiUrl = 'https://scorelord.vercel.app/api/sports?sport=all';
//   const apiKey = process.env.ODDS_API_KEY;

//   console.log('Fetching sports data from:', apiUrl);
//   console.log('API Key present:', !!apiKey);

//   try {
//     const response = await fetch(apiUrl, { 
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`,
//       },
//     });

//     console.log('Fetch response status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Error response body:', errorText);
//       throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('Received data:', JSON.stringify(data).slice(0, 200) + '...');

//     if (!Array.isArray(data)) {
//       throw new Error('Unexpected data format received from sports API');
//     }

//     return data;
//   } catch (error) {
//     console.error('Error fetching sports data:', error);
//     throw error; // Re-throw the error to be caught in the GET function
//   }
// }

// type FormattedSportsData = Record<string, any>;

// function formatDataForSlack(data: FormattedSportsData[]): SlackMessage {
//   console.log('Formatting data for Slack:', JSON.stringify(data).slice(0, 200) + '...');

//   const blocks: SlackBlock[] = data.reduce((acc: SlackBlock[], event: FormattedSportsData) => {
//     if (!event || typeof event !== 'object') {
//       console.warn('Unexpected event format:', event);
//       return acc;
//     }
//     const sport = event.sport as string | undefined;
//     const league = event.league as string | undefined;
//     const teams = Array.isArray(event.teams) ? event.teams : [];
//     const startTime = event.start_time as string | undefined;
//     const odds = event.odds as string[] | undefined;

//     if (!sport || teams.length === 0 || !startTime) {
//       console.warn('Incomplete event data:', event);
//       return acc;
//     }

//     const teamNames = teams.join(' vs ');
//     const oddsText = odds && odds.length > 0 ? odds.join(', ') : 'No odds available';

//     const block: SlackBlock = {
//       type: 'section',
//       text: {
//         type: 'mrkdwn',
//         text: `*${sport} - ${league || 'Unknown League'}*\n${teamNames}\nStart Time: ${startTime}\nOdds: ${oddsText}`
//       }
//     };

//     acc.push(block);
//     return acc;
//   }, []);

//   console.log('Formatted blocks:', JSON.stringify(blocks).slice(0, 200) + '...');

//   return { blocks };
// }

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

export async function GET() {
  try {
    console.log('Starting GET request handler');
    const message = "Hello from the sports API!";
    console.log('Sending message to Slack...');
    const slackResponse = await sendToSlack(message);
    console.log('Slack response:', slackResponse);
    
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error sending to Slack:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}