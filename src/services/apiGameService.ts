// src/services/gameService.ts
import type { ShapeType } from '../features/rooms/ChooseShapeModal'
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
  // 1. Load gameState
  const { data: match, error } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (error || !match) throw new Error('Cannot load match')

  const gs = match.gameState
  if (!gs) throw new Error('Game not started')

  if (gs.turn !== userId) throw new Error('Not your turn')

  const top = gs.discardTop

  // LEGALITY CHECK
  const isLegal =
    top.num === 20 || card.num === 20 || card.num === top.num || card.shape === top.shape

  if (!isLegal) throw new Error('Card does not match')

  // Remove from hand
  gs.hands[userId] = gs.hands[userId].filter((c) => c.id !== card.id)

  // Place in discard
  gs.discardTop = card

  const players = Object.keys(gs.hands)
  const currentIndex = players.indexOf(userId)

  // ===========================
  // SPECIAL CARD HANDLING
  // ===========================

  // If WHOT requirement is active
  if (gs.requiredShape) {
    if (card.shape !== gs.requiredShape && card.num !== 20) {
      throw new Error(`You must play a ${gs.requiredShape} card or WHOT`)
    }

    // If requirement satisfied, clear it
    if (card.shape === gs.requiredShape) {
      gs.requiredShape = null
    }
  }

  // (1) HOLD ON – Player plays again
  if (card.num === 1) {
    gs.turn = userId // Same player continues
  }

  // (2) PICK TWO stacking
  else if (card.num === 2) {
    const nextPlayer = players[(currentIndex + 1) % players.length]
    gs.stackedTwo = (gs.stackedTwo ?? 0) + 2
    gs.turn = nextPlayer
  }

  // (8) SKIP next player
  else if (card.num === 8) {
    const skipIndex = (currentIndex + 1) % players.length
    gs.skipped = players[skipIndex]

    gs.turn = players[(currentIndex + 2) % players.length]
  }

  // (14) GENERAL MARKET
  else if (card.num === 14) {
    const others = players.filter((pid) => pid !== userId)

    for (const pid of others) {
      const drawn = gs.deck.pop()
      if (drawn) gs.hands[pid].push(drawn)
    }

    // Player keeps turn
    gs.turn = userId

    // Make sure WHOT mode is cancelled
    gs.requiredShape = null
  }
  // (20) WHOT – must choose shape OR counter WHOT
  else if (card.num === 20) {
    gs.awaitingShapeChoice = userId
    gs.turn = userId // same player chooses shape
  }

  // NORMAL CARD
  else {
    gs.turn = players[(currentIndex + 1) % players.length]
  }

  // Save change
  const { error: err } = await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)

  if (err) throw err

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

export async function chooseWhotShape({
  matchId,
  userId,
  shape
}: {
  matchId: number
  userId: string
  shape: ShapeType
}) {
  const { data: match } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (!match) throw new Error('Match not found')

  const gs = match.gameState

  if (gs.awaitingShapeChoice !== userId) {
    throw new Error('Not awaiting your choice')
  }

  gs.requiredShape = shape
  gs.awaitingShapeChoice = null

  // Move turn to next player
  const players = Object.keys(gs.hands)
  const i = players.indexOf(userId)
  gs.turn = players[(i + 1) % players.length]

  await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
}

export async function resolveStackedTwo({ matchId, userId }: { matchId: number; userId: string }) {
  const { data: match } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (!match) throw new Error('Match not found')
  const gs = match.gameState

  const amount = gs.stackedTwo || 0
  if (amount === 0) return

  for (let i = 0; i < amount; i++) {
    const card = gs.deck.pop()
    if (card) gs.hands[userId].push(card)
  }

  gs.stackedTwo = 0

  // Advance turn
  const players = Object.keys(gs.hands)
  const nextIndex = (players.indexOf(userId) + 1) % players.length
  gs.turn = players[nextIndex]

  await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
}
