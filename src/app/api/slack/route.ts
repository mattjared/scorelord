import { NextResponse } from 'next/server';

interface FormattedSportsData {
  // Define specific fields based on your data structure
  sport: string;
  event: string;
  date: string;
  time: string;
  teams: string[];
  score?: string;
  // Add more fields as needed
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  fields?: { type: string; text: string }[];
}

interface SlackMessage {
  blocks: SlackBlock[];
}

async function fetchSportsData(): Promise<FormattedSportsData[]> {
  const apiUrl = 'https://scorelord.vercel.app/api/sports?sport=all';
  const apiKey = process.env.ODDS_API_KEY;

  console.log('Fetching sports data from:', apiUrl);
  console.log('API Key present:', !!apiKey);

  try {
    const response = await fetch(apiUrl, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    console.log('Fetch response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received data:', JSON.stringify(data).slice(0, 200) + '...');

    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format received from sports API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching sports data:', error);
    throw error; // Re-throw the error to be caught in the GET function
  }
}

function formatDataForSlack(data: FormattedSportsData[]): SlackMessage {
  const blocks = data.map(event => ({
    type: 'section',
    fields: [
      {
        type: 'mrkdwn',
        text: `*Sport:* ${event.sport}`
      },
      {
        type: 'mrkdwn',
        text: `*Event:* ${event.event}`
      },
      {
        type: 'mrkdwn',
        text: `*Date:* ${event.date}`
      },
      {
        type: 'mrkdwn',
        text: `*Time:* ${event.time}`
      },
      {
        type: 'mrkdwn',
        text: `*Teams:* ${event.teams.join(' vs ')}`
      },
      {
        type: 'mrkdwn',
        text: `*Score:* ${event.score || 'N/A'}`
      }
    ]
  }));

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Sports Update*'
        }
      },
      {
        type: 'divider'
      },
      ...blocks
    ]
  };
}

async function sendToSlack(formattedData: FormattedSportsData[]) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    throw new Error('Slack webhook URL is not configured');
  }
  
  const formattedSlackMessage = formatDataForSlack(formattedData);
  
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedSlackMessage),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Slack API error:', errorText);
    throw new Error(`Failed to send data to Slack: ${response.status} ${errorText}`);
  }

  return response.text();
}

export async function GET() {
  try {
    console.log('Starting GET request handler');
    const sportsData = await fetchSportsData();
    console.log('Sports data fetched successfully, length:', sportsData.length);

    console.log('Sending data to Slack...');
    const slackResponse = await sendToSlack(sportsData);
    console.log('Slack response:', slackResponse);
    
    return NextResponse.json({ success: true, slackResponse });
  } catch (error) {
    console.error('Error processing sports data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
