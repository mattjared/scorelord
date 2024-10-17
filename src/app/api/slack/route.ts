import { NextResponse } from 'next/server';

async function sendToSlack(message: string) {
  console.log('Entering sendToSlack function');
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    console.error('Slack webhook URL is not configured');
    throw new Error('Slack webhook URL is not configured');
  }
  
  console.log('Attempting to send message to Slack');
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  });

  console.log('Slack API response status:', response.status);
  if (!response.ok) {
    console.error('Failed to send message to Slack:', response.statusText);
    throw new Error(`Failed to send message to Slack: ${response.status}`);
  }

  const responseText = await response.text();
  console.log('Slack API response:', responseText);
  return responseText;
}

async function fetchSportsData(sport: string) {
  const apiUrl = `http://localhost:3000/api/sports?sport=${sport}`;
  console.log('Fetching sports data from:', apiUrl);
  
  const response = await fetch(apiUrl, { 
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.text();
  console.log('Response status:', response.status);
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

export async function GET() {
  console.log('Starting GET request handler');
  try {
    const message = "Test message from Next.js API route";
    console.log('Preparing to send message:', message);
    const slackResponse = await sendToSlack(message);
    console.log('Message sent successfully');
    
    return NextResponse.json({ success: true, message: 'Message sent to Slack', response: slackResponse });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  console.log('POST request received');
  try {
    console.log('Fetching baseball data...');
    const sportsData = await fetchSportsData('baseball');
    console.log('Sports data fetched:', sportsData);

    const message = `Hello from the web app! Here's the latest baseball data:\n${JSON.stringify(sportsData, null, 2)}`;
    
    console.log('Sending message to Slack:', message);
    await sendToSlack(message);
    
    return NextResponse.json({ success: true, message: 'Message sent to Slack with sports data' });
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
