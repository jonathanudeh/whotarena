import { supabase } from './supabase'

export async function joinOrCreateMatch({
  roomId,
  userId
}: {
  roomId: number
  userId: string
}): Promise<number> {
  // Find a waiting match
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

  // If no match found, create one
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

  // Count players BEFORE insert
  // todo: race condition possible here - two players could join simultaneously exceeding maxPlayers limit
  // todo: a player already in the match cant join again - need to handle these cases.

  const { data: players } = await supabase.from('matchPlayers').select('id').eq('matchId', matchId)

  if (players && players.length >= match.maxPlayers) {
    throw new Error('Match is already full.')
  }

  //  Insert player
  await supabase
    .from('matchPlayers')
    .insert({
      matchId,
      userId
    })
    .select()
    .single()

  //  Recount players AFTER join

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

function generateAIName() {
  const names = [
    'Tobi',
    'Zed',
    'Ada',
    'Nova',
    'Ace',
    'Kairo',
    'Roda',
    'Craze',
    'Luna',
    'Princess',
    'Elon',
    'Rex',
    'Qwin',
    'Alex',
    'Stanley',
    'Willy',
    'Girl',
    'Winner',
    'Flash',
    'Jinx',
    'Mary',
    'Shadow',
    'Richy',
    'Funmi'
  ]
  // const suffix = Math.floor(Math.random() * 100)
  return `${names[Math.floor(Math.random() * names.length)]}`
}

function generateAIAvatar() {
  const seed = Math.random().toString(36).slice(2)
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`
}

export async function maybeAddAIPlayers(matchId: number) {
  // 1. Fetch fresh match
  const { data: match, error: matchErr } = await supabase
    .from('matches')
    .select('id, maxPlayers, status')
    .eq('id', matchId)
    .single()

  if (matchErr || !match) return
  if (match.status !== 'waiting') return

  // 2. Fetch current players
  const { data: players, error: playersErr } = await supabase
    .from('matchPlayers')
    .select('*')
    .eq('matchId', matchId)

  if (playersErr || !players) return

  const humanCount = players.filter((p) => p.playerType === 'human').length
  const aiCount = players.filter((p) => p.playerType === 'ai').length

  // Prevent double AI injection
  if (aiCount > 0) return

  // Only fill empty slots
  const totalPlayers = humanCount + aiCount
  const slotsLeft = match.maxPlayers - totalPlayers

  if (slotsLeft <= 0) return

  // 3. Recheck match status before insert
  const { data: freshMatch } = await supabase
    .from('matches')
    .select('status')
    .eq('id', matchId)
    .single()

  if (!freshMatch || freshMatch.status !== 'waiting') return

  // 4 Insert AI players to fill remaining slots
  const aiPlayers = Array.from({ length: slotsLeft }).map(() => ({
    matchId,
    playerType: 'ai',
    displayName: generateAIName(),
    avatarUrl: generateAIAvatar()
  }))

  const { error: insertErr } = await supabase.from('matchPlayers').insert(aiPlayers)

  if (insertErr) {
    console.error('Failed to insert players', insertErr)
    return
  }

  // 5. Recount players after AI insert
  const { data: updatedPlayers } = await supabase
    .from('matchPlayers')
    .select('id')
    .eq('matchId', matchId)

  if (!updatedPlayers) return

  if (updatedPlayers.length === match.maxPlayers) {
    await supabase
      .from('matches')
      .update({
        status: 'playing',
        startedAt: new Date().toISOString()
      })
      .eq('id', matchId)
  }
}

// for the gameboard
export async function getMatch(matchId: number) {
  const { data, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      room: rooms (
        entryFee,
        prize
      )
    `
    )
    .eq('id', matchId)
    .single()

  if (error) throw new Error(error.message)

  console.log('getMatch result for', matchId, ':', { data, prize: data?.room?.prize })

  return {
    ...data,
    entryFee: data?.room?.entryFee,
    prize: data?.room?.prize
  }
}

// for gameboard
export async function getMatchPlayers(matchId: number) {
  const { data, error } = await supabase.from('matchPlayers').select('*').eq('matchId', matchId)

  if (error) throw new Error(error.message)
  return data
}
