export async function fetchSportsData(sport: string) {
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

export async function sendToSlack(message: string, sport: string) {
  const webhookUrl = getWebhookUrlForSport(sport)
  console.log(message);
  if (!webhookUrl) {
    throw new Error('Slack webhook URL is not configured');
  }
  
  const response = await fetch(webhookUrl, {
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

function getWebhookUrlForSport(sport: string): string {
  switch (sport.toLowerCase()) {
    case 'NBA':
      return process.env.SLACK_WEBHOOK_URL_NBA || '';
    default:
      return process.env.SLACK_WEBHOOK_URL || '';
  }
}