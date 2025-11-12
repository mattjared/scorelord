import { supabase } from '@/app/lib/supabase';
import { GameScore, sports } from '@/app/lib/sports';
import { NextResponse } from 'next/server';

// retrieve all scores and add them to the database
export async function GET() {
  try {
    const allScores = await Promise.all(
      sports.map(async (sport) => {
        const response = await fetch(`${process.env.API_BASE_URL}/${sport.key}/scores?apiKey=${process.env.ODDS_API_KEY}&daysFrom=1&dateFormat=iso`);
        const data = await response.json();
        return data;
      })
    );
    const flattenedScores = allScores.flat() as GameScore[];
    
    // Update scores in database
    const updateResults = await updateGameScores(flattenedScores);
    
    return NextResponse.json({ 
      message: 'Scores updated successfully', 
      gamesUpdated: updateResults.success,
      gamesFailed: updateResults.failed,
      totalGames: flattenedScores.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving scores:', error);
    return NextResponse.json({ error: 'Failed to retrieve scores', details: error }, { status: 500 });
  }
}

async function updateGameScores(games: GameScore[]) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const game of games) {
    try {
      // Skip if no scores available
      if (!game.scores || game.scores.length === 0) {
        console.log(`⏭️  Skipping game ${game.id} - no scores available yet`);
        continue;
      }

      // Extract home and away scores from the scores array
      const homeScore = game.scores.find(s => s.name === game.home_team)?.score;
      const awayScore = game.scores.find(s => s.name === game.away_team)?.score;

      // Skip if we couldn't find both scores
      if (!homeScore || !awayScore) {
        console.log(`⚠️  Game ${game.id} missing score data`);
        continue;
      }

      // Update the game in the database
      const { data, error } = await supabase
        .from('games')
        .update({
          home_score: parseInt(homeScore),
          away_score: parseInt(awayScore),
          completed: game.completed,
          last_updated: new Date().toISOString()
        })
        .eq('game_id', game.id)
        .select();

      if (error) {
        console.error(`❌ Error updating game ${game.id}:`, error);
        results.failed++;
        results.errors.push(`${game.id}: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`✅ Updated game ${game.id}: ${game.away_team} ${awayScore} - ${homeScore} ${game.home_team}`);
        results.success++;
      } else {
        console.log(`⚠️  Game ${game.id} not found in database`);
        results.failed++;
      }
    } catch (error) {
      console.error(`Error processing game ${game.id}:`, error);
      results.failed++;
      results.errors.push(`${game.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`\n📊 Update Summary: ${results.success} successful, ${results.failed} failed`);
  return results;
}