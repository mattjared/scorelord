import { NextResponse } from 'next/server';

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
    const message = "Hello from the web app!";
    await sendToSlack(message);
    
    return NextResponse.json({ success: true, message: 'Message sent to Slack' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}