// src/services/gameService.ts
import { supabase } from './supabase'

/**
 * Types
 */
export type Shape = 'circle' | 'triangle' | 'cross' | 'square' | 'star' | 'whot'
export type Card = { id: string; shape: Shape; num: number } // small card shape/num identifier

export type GameState = {
  deck: Card[] // remaining draw pile (top is at index 0)
  discardTop: Card | null // top of discard pile
  hands: Record<string, Card[]> // map userId -> array of cards (their hand)
  turn: string | null // userId whose turn it is
  status: 'waiting' | 'playing' | 'finished'
  createdAt: string
}

/**
 * Build the exact Naija Whot deck
 * Returns flat array of Card objects.
 */
export function buildWhotDeck(): Card[] {
  const deck: Card[] = []
  let uid = 0
  const push = (shape: Shape, num: number) => {
    deck.push({ id: `${shape}-${num}-${uid++}`, shape, num })
  }

  // Circles 1,2,3,4,5,7,8,10,11,12,13,14
  const circleNums = [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14]
  circleNums.forEach((n) => push('circle', n))

  // Triangles
  const triangleNums = [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14]
  triangleNums.forEach((n) => push('triangle', n))

  // Crosses
  const crossNums = [1, 2, 3, 5, 7, 10, 11, 13, 14]
  crossNums.forEach((n) => push('cross', n))

  // Squares
  const squareNums = [1, 2, 3, 5, 7, 10, 11, 13, 14]
  squareNums.forEach((n) => push('square', n))

  // Stars
  const starNums = [1, 2, 3, 4, 5, 7, 8]
  starNums.forEach((n) => push('star', n))

  // Whot cards (five 20s)
  for (let i = 0; i < 5; i++) push('whot', 20)

  return deck
}

/**
 * Fisher-Yates shuffle (in place). Returns new shuffled array.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * startGame:
 * - matchId: matches.id (int)
 * - deals 5 cards to each player in matchPlayers (order returned by DB)
 * - sets discardTop (pop from deck)
 * - builds gameState and updates matches row
 *
 * NOTE: This runs on the client (service call). You can later move to RPC for atomicity.
 */
export async function startGame({
  matchId,
  cardCountPerPlayer = 5
}: {
  matchId: number
  cardCountPerPlayer?: number
}): Promise<{ success: boolean; match?: any; gameState?: GameState }> {
  // 1. Fetch match + players
  const { data: match, error: matchErr } = await supabase
    .from('matches')
    .select('id, roomId, maxPlayers, status')
    .eq('id', matchId)
    .single()

  if (matchErr) throw matchErr
  if (!match) throw new Error('match not found')

  // 2. Get players (ordered by created_at for deterministic dealing)
  const { data: matchPlayers, error: playersErr } = await supabase
    .from('matchPlayers')
    .select('id, userId, created_at')
    .eq('matchId', matchId)
    .order('created_at', { ascending: true })

  if (playersErr) throw playersErr
  if (!matchPlayers || matchPlayers.length === 0) throw new Error('no players in match')

  // 3. Build & shuffle deck
  const deck = shuffle(buildWhotDeck())

  // 4. Prepare hands
  const hands: Record<string, Card[]> = {}
  for (const p of matchPlayers) hands[p.userId] = []

  // 5. Deal round-robin cardCountPerPlayer cards
  let deckCursor = 0
  for (let round = 0; round < cardCountPerPlayer; round++) {
    for (const p of matchPlayers) {
      if (deckCursor >= deck.length) break
      const card = deck[deckCursor++]
      hands[p.userId].push(card)
    }
  }

  // 6. Set discardTop by drawing next card from deck
  let discardTop: Card | null = null
  if (deckCursor < deck.length) {
    discardTop = deck[deckCursor++]
  }

  // 7. Remaining deck (market): top is at index 0 (we will use slice)
  const remainingDeck = deck.slice(deckCursor)

  // 8. Choose first player as the one who dealt last card? (common is first player in players array)
  // We'll make the first player in matchPlayers the starter (you can change later).
  const firstPlayerUserId = matchPlayers[0].userId

  // 9. Build gameState
  const gameState: GameState = {
    deck: remainingDeck,
    discardTop,
    hands,
    turn: firstPlayerUserId,
    status: 'playing',
    createdAt: new Date().toISOString()
  }

  // 10. Update matches row with gameState, status, startedAt
  const { data: updated, error: updateErr } = await supabase
    .from('matches')
    .update({ gameState, status: 'playing', startedAt: new Date().toISOString() })
    .eq('id', matchId)
    .select()
    .single()

  if (updateErr) throw updateErr

  return { success: true, match: updated, gameState }
}

export async function playMove({
  matchId,
  userId,
  card
}: {
  matchId: number
  userId: string
  card: Card
}) {
  // 1. Fetch current match gameState
  const { data: match, error } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (error || !match) throw new Error('Cannot load match')
  const gs = match.gameState

  if (!gs) throw new Error('Game not started yet')

  // 2. Validate it's player's turn
  if (gs.turn !== userId) throw new Error('Not your turn')

  const top = gs.discardTop

  // 3. VALIDATE LEGAL CARD MATCH
  const matches =
    card.num === top.num || // same number
    card.shape === top.shape || // same shape
    card.num === 20 || // WHOT (always playable)
    top.num === 20 // match card situation

  if (!matches) {
    throw new Error('Card does not match the top card')
  }

  // 4. Remove card from player's hand
  gs.hands[userId] = gs.hands[userId].filter((c: Card) => c.id !== card.id)

  // 5. Update discard pile
  gs.discardTop = card

  // 6. Rotate turn
  const playerIds = Object.keys(gs.hands)
  const i = playerIds.indexOf(userId)
  gs.turn = playerIds[(i + 1) % playerIds.length]

  // 7. Save back to DB
  const { error: updateErr } = await supabase
    .from('matches')
    .update({ gameState: { ...gs } })
    .eq('id', matchId)

  if (updateErr) throw updateErr

  return true
}

export async function pickFromMarket({ matchId, userId }: { matchId: number; userId: string }) {
  const { data: match } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (!match) return

  const state = match.gameState
  if (!state) throw new Error('Game not started')

  if (state.turn !== userId) {
    throw new Error('Not your turn')
  }

  if (state.deck.length === 0) {
    throw new Error('Market empty')
  }

  const newCard = state.deck.pop()

  state.hands[userId].push(newCard)

  // Rotate turn
  const playerIds = Object.keys(state.hands)
  const i = playerIds.indexOf(userId)
  state.turn = playerIds[(i + 1) % playerIds.length]

  await supabase.from('matches').update({ gameState: state }).eq('id', matchId)
}
