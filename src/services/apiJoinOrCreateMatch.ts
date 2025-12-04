import { supabase } from './supabase'

export async function joinOrCreateMatch({ roomId, userId }) {
  // -----------------------------------
  // 1. Find a waiting match
  // -----------------------------------
  const { data: matches, error: matchErr } = await supabase
    .from('matches')
    .select('id, maxPlayers')
    .eq('roomId', roomId)
    .eq('status', 'waiting')

  if (matchErr) throw matchErr

  let match = null

  // Try to find a match that is NOT full
  for (const m of matches) {
    const { data: players } = await supabase.from('matchPlayers').select('id').eq('matchId', m.id)

    if (players && players.length < m.maxPlayers) {
      match = m
      break
    }
  }

  // -----------------------------------
  // 2. If no match found → create one
  // -----------------------------------
  if (!match) {
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('maxPlayers')
      .eq('id', roomId)
      .single()

    if (roomErr) throw roomErr

    const { data: newMatch, error: createErr } = await supabase
      .from('matches')
      .insert({
        roomId,
        maxPlayers: room.maxPlayers
      })
      .select()
      .single()

    if (createErr) throw createErr
    match = newMatch
  }

  const matchId = match.id

  // -----------------------------------
  // 3. Count players BEFORE insert
  // -----------------------------------
  const { data: players } = await supabase.from('matchPlayers').select('id').eq('matchId', matchId)

  if (players && players.length >= match.maxPlayers) {
    throw new Error('Match is already full.')
  }

  // 4. Insert player
  await supabase
    .from('matchPlayers')
    .insert({
      matchId,
      userId
    })
    .select()
    .single()

  // -----------------------------------
  // 5. Recount players AFTER join
  // -----------------------------------
  const { data: updatedPlayers, error: countErr } = await supabase
    .from('matchPlayers')
    .select('id')
    .eq('matchId', matchId)

  if (countErr) throw countErr

  // Fetch fresh match because "match.maxPlayers" might be stale
  const { data: freshMatch } = await supabase.from('matches').select('*').eq('id', matchId).single()

  if (updatedPlayers.length === freshMatch.maxPlayers) {
    await supabase
      .from('matches')
      .update({
        status: 'playing',
        startedAt: new Date().toISOString()
      })
      .eq('id', matchId)
  }

  return matchId
}

// for the gameboard
export async function getMatch(matchId: number) {
  const { data, error } = await supabase.from('matches').select('*').eq('id', matchId).single()

  if (error) throw new Error(error.message)
  return data
}

// for gameboard
export async function getMatchPlayers(matchId: number) {
  const { data, error } = await supabase
    .from('matchPlayers')
    .select('id, userId, created_at')
    .eq('matchId', matchId)

  if (error) throw new Error(error.message)
  return data
}
