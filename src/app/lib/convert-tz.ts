// convert to Eastern Time
// takes ISO string and returns YYYY-MM-DD

// returns YYYY-MM-DD
export const convertTzReturnDateOnly = (date: string): string => {
  // convert to Eastern Time
  const dateET = new Date(date).toLocaleString('en-US', { timeZone: 'America/New_York', day: 'numeric', month: 'numeric', year: 'numeric' });
  return dateET;
}

export const todaysDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', day: 'numeric', month: 'numeric', year: 'numeric' });