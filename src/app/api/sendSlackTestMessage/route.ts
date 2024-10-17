import { NextResponse } from 'next/server';

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
    console.log('Fetching MLB data...');
    const sportsData = await fetchSportsData('MLB');
    const message = `Hello from the web app! Here's the latest MLB data:\n${JSON.stringify(sportsData, null, 2)}`;
    await sendToSlack(message);
    
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
