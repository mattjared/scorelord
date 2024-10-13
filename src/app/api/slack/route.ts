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

async function fetchSportsData() {
  const response = await fetch(`${process.env.VERCEL_URL}/api/sports?sport=all`);
  if (!response.ok) {
    throw new Error('Failed to fetch sports data');
  }
  return response.json();
}

async function sendToSlack(formattedData: FormattedSportsData) {
  const slackWebhookUrl = 'https://hooks.slack.com/triggers/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';
  
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  });

  if (!response.ok) {
    throw new Error('Failed to send data to Slack');
  }

  return response.json();
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
