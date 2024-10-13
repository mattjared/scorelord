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

async function fetchSportsData(): Promise<FormattedSportsData[]> {
  const apiUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/sports?sport=all` 
    : 'http://localhost:3000/api/sports?sport=all';
  
  try {
    const response = await fetch(apiUrl, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format received from sports API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching sports data:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch sports data: ${error.message}`);
    } else {
      throw new Error('Failed to fetch sports data: Unknown error');
    }
  }
}

async function sendToSlack(formattedData: FormattedSportsData[]) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    throw new Error('Slack webhook URL is not configured');
  }
  
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: formattedData }),
  });

  if (!response.ok) {
    throw new Error('Failed to send data to Slack');
  }

  return response.text();
}

export async function GET() {
  try {
    console.log('Fetching sports data...');
    const sportsData = await fetchSportsData();
    console.log('Sports data fetched successfully:', sportsData);

    console.log('Sending data to Slack...');
    const slackResponse = await sendToSlack(sportsData);
    console.log('Slack response:', slackResponse);
    
    return NextResponse.json({ success: true, slackResponse });
  } catch (error) {
    console.error('Error processing sports data or sending to Slack:', error);
    return NextResponse.json(
      { error: `Failed to process sports data or send to Slack: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}
