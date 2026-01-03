import { supabase } from './supabase'

export async function finalizeMatch({
  matchId,
  winnerId,
  prizeAmount,
  playerIds
}: {
  matchId: number
  winnerId: string | null
  prizeAmount: number
  playerIds: string[]
}) {
  const { error } = await supabase.rpc('finalize_match', {
    match_id: matchId,
    winner_id: winnerId,
    prize_amount: prizeAmount,
    player_ids: playerIds
  })

  if (error) throw error
}
