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
  const apiUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/sports?sport=all` : 'http://localhost:3000/api/sports?sport=all';
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch sports data');
  }
  return response.json();
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
    const sportsData = await fetchSportsData();
    const slackResponse = await sendToSlack(sportsData);
    
    return NextResponse.json({ success: true, slackResponse });
  } catch (error) {
    console.error('Error processing sports data or sending to Slack:', error);
    return NextResponse.json({ error: 'Failed to process sports data or send to Slack' }, { status: 500 });
  }
}