import type { ShapeType } from '../features/rooms/ChooseShapeModal'
import { getWinnerFromTotals } from '../utils/helper'
import { supabase } from './supabase'

// DEBUG HELPER
function logState(gs: any, label = '') {
  console.log(`=== ${label} ===`)
  console.log('turn:', gs.turn)
  console.log('turnIndex:', gs.turnIndex)
  console.log('playerOrder:', gs.playerOrder)
  console.log('playerMeta:', gs.playerMeta)
  console.log(
    'hands:',
    Object.fromEntries(
      Object.entries(gs.hands).map(([k, v]) => [k, v.map((c: any) => `${c.shape}${c.num}`)])
    )
  )
  console.log('deck top:', gs.deck[gs.deck.length - 1])
  console.log('discardTop:', gs.discardTop)
  console.log('stackedTwo:', gs.stackedTwo)
  console.log('awaitingShapeChoice:', gs.awaitingShapeChoice)
  console.log('==================')
}

// SAFE playerId resolver
function resolvePlayerId(gs: any, userId: string): string {
  if (gs.playerMeta[userId]) return userId
  const pid = Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
  if (!pid) throw new Error(`Invalid playerId: ${userId}`)
  return pid
}

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
  // 1. Fetch match + room
  const { data: match, error: matchErr } = await supabase
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

  //// 4. Prepare hands
  // const hands: Record<string, Card[]> = {}
  // for (const p of matchPlayers) hands[p.userId] = []

  // 4. Prepare hands with runtime playerId
  const hands: Record<string, Card[]> = {}
  const playerOrder: string[] = []
  const playerMeta: Record<string, { userId: string | null; type: 'human' | 'ai' }> = {}

  for (const p of matchPlayers) {
    const pid = p.userId ?? p.id

    hands[pid] = [] // <-- initialize before pushing
    playerOrder.push(pid)

    playerMeta[pid] = {
      userId: p.userId,
      type: p.userId ? 'human' : 'ai'
    }
  }

  // 5. Deal round-robin cardCountPerPlayer cards
  let deckCursor = 0
  for (let round = 0; round < cardCountPerPlayer; round++) {
    for (const p of matchPlayers) {
      const pid = p.userId ?? p.id // <-- use same runtime pid
      if (deckCursor >= deck.length) break
      const card = deck[deckCursor++]
      hands[pid].push(card) // ✅ safe now
    }
  }

  // 6. Set discardTop by drawing next card from deck
  let discardTop: Card | null = null
  if (deckCursor < deck.length) {
    discardTop = deck[deckCursor++]
  }

  // 7. Remaining deck (market): slice and REVERSE so top is at the end -> use pop()
  const remainingDeck = deck.slice(deckCursor).reverse()

  // 8. Choose first player as matchPlayers[0]
  // const playerOrder = matchPlayers.map((p) => p.userId)

  // const firstPlayerUserId = playerOrder[0]
  const firstPlayerId = playerOrder[0] // choose first player

  // 9. Build gameState (include playerOrder and turnIndex)
  //useg gamestate type
  const gameState: any = {
    deck: remainingDeck, // top is at end -> .pop() draws top
    discardTop,
    hands,
    turn: firstPlayerId,
    playerOrder,
    playerMeta,
    turnIndex: 0,
    status: 'playing',
    turnEndTime: new Date(Date.now() + 20 * 1000).toISOString(),
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
  // Load state
  const { data: match, error } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (error || !match) throw new Error('Cannot load match')

  const gs = match.gameState
  if (!gs) throw new Error('Game not started')

  //  EARLY DECK EMPTY WIN CHECK
  if (gs.deck.length === 0 && !gs.finished) {
    const winner = getWinnerFromTotals(gs)
    gs.winner = winner
    gs.finished = true
    gs.status = 'finished'

    await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
    return true
  }

  if (gs.turn !== userId) throw new Error('Not your turn')

  const top = gs.discardTop

  if (gs.turnEndTime && Date.now() > new Date(gs.turnEndTime).getTime()) {
    // turn already expired — auto-resolve before continuing
    await pickFromMarket({ matchId, userId: gs.turn })
    return
  }

  // LEGALITY CHECK
  const isLegal =
    top?.num === 20 || card.num === 20 || card.num === top?.num || card.shape === top?.shape

  if (!isLegal) throw new Error('Card does not match')

  // PICK TWO BLOCKING
  if (gs.stackedTwo > 0 && card.num !== 2) {
    throw new Error('You must pick your stacked 2s')
  }

  // Remove played card
  const playerId = Object.keys(gs.playerMeta).includes(userId)
    ? userId
    : Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
  if (!playerId) throw new Error(`Invalid playerId: ${userId}`)

  gs.hands[playerId] = gs.hands[playerId].filter((c) => c.id !== card.id)

  // Put on discard
  gs.discardTop = card

  // -----------------------------
  // USE EXISTING MATCH TURN ORDER (fallback to keys if missing)
  // -----------------------------
  const players: string[] =
    Array.isArray(gs.playerOrder) && gs.playerOrder.length > 0
      ? gs.playerOrder
      : Object.keys(gs.hands)

  // Ensure turnIndex exists and points to current user
  if (typeof gs.turnIndex !== 'number') {
    gs.turnIndex = players.indexOf(gs.turn)
    if (gs.turnIndex < 0) gs.turnIndex = 0
  }
  const currentIndex = gs.turnIndex

  // -----------------------------
  // WHOT requirement handling
  // -----------------------------
  if (gs.requiredShape) {
    if (card.num !== 20 && card.shape !== gs.requiredShape) {
      throw new Error(`You must play a ${gs.requiredShape} card or WHOT`)
    }

    // reset only when a non-WHOT satisfies it (or allow clearing on WHOT since awaitingShapeChoice will set new)
    if (card.num !== 20 && card.shape === gs.requiredShape) {
      gs.requiredShape = null
    }
  }

  // ==============================
  // SPECIAL CARDS
  // ==============================

  if (card.num === 1) {
    // HOLD ON — same player continues
    gs.turnIndex = currentIndex
  } else if (card.num === 2) {
    // PICK TWO — stack and next player handles it
    gs.stackedTwo = (gs.stackedTwo ?? 0) + 2
    gs.turnIndex = (currentIndex + 1) % players.length
  } else if (card.num === 8) {
    // SKIP — skip next player
    gs.skipped = players[(currentIndex + 1) % players.length]
    gs.turnIndex = (currentIndex + 2) % players.length
  } else if (card.num === 14) {
    // GENERAL MARKET — every other player draws 1
    const others = players.filter((pid) => pid !== playerId)
    for (const pid of others) {
      if (gs.deck.length > 0) {
        const drawn = gs.deck.pop()
        if (drawn) gs.hands[pid].push(drawn)
      }
    }

    gs.requiredShape = null
    gs.turnIndex = currentIndex // player keeps turn
  } else if (card.num === 20) {
    // WHOT — player must pick shape or another WHOT can counter
    gs.awaitingShapeChoice = playerId
    gs.awaitingShapeEndTime = new Date(Date.now() + 20 * 1000).toISOString()
    gs.turnIndex = currentIndex
  } else {
    // NORMAL CARD
    gs.turnIndex = (currentIndex + 1) % players.length
  }

  // ===========================
  // WIN LOGIC
  // ===========================

  //  Player emptied hand
  if (gs.hands[playerId].length === 0) {
    gs.winner = playerId
    gs.finished = true
    gs.status = 'finished'
  }

  gs.turn = players[gs.turnIndex]

  // Set turn end time if not finished and not awaiting shape
  if (!gs.finished && !gs.awaitingShapeChoice) {
    gs.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()
  }

  // Build a lastAction object so clients can show toasts
  gs.lastAction = {
    id: `${Date.now()}-${userId}`, // unique id
    type: 'play', // action type
    actor: playerId,
    cardNum: card.num,
    cardShape: card.shape ?? null,
    stackedTwo: gs.stackedTwo ?? 0,
    // compute target for cases where a specific player is affected:
    target:
      card.num === 2
        ? players[(currentIndex + 1) % players.length]
        : card.num === 8
          ? players[(currentIndex + 1) % players.length]
          : null,
    createdAt: new Date().toISOString()
  }

  // Save state
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

  const playerId = Object.keys(state.playerMeta).includes(userId)
    ? userId
    : Object.keys(state.playerMeta).find((k) => state.playerMeta[k].userId === userId)

  if (!playerId) throw new Error(`Invalid playerId: ${userId}`)

  // check if stacktwo is active and resolve it first
  if (state.stackedTwo && state.stackedTwo > 0) {
    // resolvestackedtwo function will handle drawing cards and advancing turn
    await resolveStackedTwo({ matchId, userId: playerId })
    return
  }

  if (state.turn !== playerId) {
    throw new Error('Not your turn')
  }

  if (!state.deck || state.deck.length === 0) {
    throw new Error('Market empty')
  }

  // 👉 Draw the card
  const newCard = state.deck.pop()
  if (newCard) state.hands[playerId ?? userId].push(newCard)

  // RIGHT HERE — check if deck is empty AFTER drawing
  if (state.deck.length === 0 && !state.finished) {
    const winner = getWinnerFromTotals(state)
    state.winner = winner
    state.finished = true
    state.status = 'finished'

    await supabase
      .from('matches')
      .update({ gameState: state, status: 'ended', endedAt: new Date().toISOString() })
      .eq('id', matchId)

    return true
  }

  // Advance turn based on playerOrder
  const players: string[] =
    Array.isArray(state.playerOrder) && state.playerOrder.length > 0
      ? state.playerOrder
      : Object.keys(state.hands)

  // Ensure turnIndex exists
  if (typeof state.turnIndex !== 'number') {
    state.turnIndex = players.indexOf(state.turn)
    if (state.turnIndex < 0) state.turnIndex = 0
  }

  state.turnIndex = (state.turnIndex + 1) % players.length
  state.turn = players[state.turnIndex]
  state.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()

  //   // Clear the previous action so stale toasts don't re-trigger
  //   if (state.lastAction && state.lastAction.type !== 'chooseShape') {
  //     state.lastAction = null
  //   }

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

  const playerId = gs.playerMeta[userId]
    ? Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
    : userId

  if (gs.awaitingShapeChoice !== playerId) {
    throw new Error('Not awaiting your choice')
  }

  // set required shape
  gs.requiredShape = shape
  gs.awaitingShapeChoice = null

  // Advance turn to next player using playerOrder
  const players: string[] =
    Array.isArray(gs.playerOrder) && gs.playerOrder.length > 0
      ? gs.playerOrder
      : Object.keys(gs.hands)

  if (typeof gs.turnIndex !== 'number') {
    gs.turnIndex = players.indexOf(playerId ?? userId)
    if (gs.turnIndex < 0) gs.turnIndex = 0
  }

  gs.turnIndex = (gs.turnIndex + 1) % players.length
  gs.turn = players[gs.turnIndex]

  // Set turn end time
  gs.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()

  // after setting gs.requiredShape = shape and clearing gs.awaitingShapeChoice
  gs.lastAction = {
    id: `${Date.now()}-${playerId}`,
    type: 'chooseShape',
    actor: playerId,
    shape,
    createdAt: new Date().toISOString()
  }

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

  const playerId = gs.playerMeta[userId]
    ? Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
    : userId

  const amount = gs.stackedTwo || 0
  if (amount === 0) return

  for (let i = 0; i < amount; i++) {
    const card = gs.deck.pop()
    if (card) gs.hands[playerId ?? userId].push(card)
  }

  gs.stackedTwo = 0

  // Advance turn to next player in order
  const players: string[] =
    Array.isArray(gs.playerOrder) && gs.playerOrder.length > 0
      ? gs.playerOrder
      : Object.keys(gs.hands)

  if (typeof gs.turnIndex !== 'number') {
    gs.turnIndex = players.indexOf(playerId ?? userId)
    if (gs.turnIndex < 0) gs.turnIndex = 0
  }

  gs.turnIndex = (gs.turnIndex + 1) % players.length
  gs.turn = players[gs.turnIndex]
  gs.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()

  // Clear the previous action so stale toasts don't re-trigger
  if (gs.lastAction && gs.lastAction.type !== 'chooseShape') {
    // Keep chooseShape lastAction visible until a regular play consumes it
    gs.lastAction = null
  }

  await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
}

export async function updateMatchResults(
  winnerId: string,
  playerIds: string[],
  matchId: number
): Promise<{ ok: true }> {
  // Validate and sanitize
  const validatedWinner = typeof winnerId === 'string' && winnerId.trim() !== '' ? winnerId : null
  const validatedPlayers = Array.isArray(playerIds)
    ? playerIds.filter((id) => typeof id === 'string' && id.trim() !== '')
    : []

  if (!validatedWinner) {
    console.warn('Skipping increment_profile_stats: invalid winnerId', winnerId)
  } else {
    console.log('Calling increment_profile_stats', {
      winner_id: validatedWinner,
      player_ids: validatedPlayers
    })

    const { data, error } = await supabase.rpc('increment_profile_stats', {
      player_ids: validatedPlayers,
      winner_id: validatedWinner
    })

    if (error) {
      console.error('RPC error increment_profile_stats', error)
      throw error
    }

    console.log('increment_profile_stats success', data)

    const { error: updateErr } = await supabase
      .from('matches')
      .update({ status: 'ended', endedAt: new Date().toISOString() })
      .eq('id', matchId)
      .select()
      .single()

    if (updateErr) {
      console.error('Error updating match', updateErr)
      throw new Error(updateErr.message)
    }

    console.log('Match updated successfully')
  }

  return { ok: true }
}

export async function advanceTurn({ matchId, userId }: { matchId: number; userId: string }) {
  const { data: match, error } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (error || !match) throw new Error('Cannot load match')

  const gs = match.gameState
  if (!gs) throw new Error('Game not started')

  const playerId = gs.playerMeta[userId]
    ? Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
    : userId

  if (gs.turn !== playerId) throw new Error('Not your turn')

  // Advance turn
  const players = gs.playerOrder
  const currentIndex = gs.turnIndex
  gs.turnIndex = (currentIndex + 1) % players.length
  gs.turn = players[gs.turnIndex]

  // Set turn end time
  gs.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()

  // Clear any lastAction
  gs.lastAction = null

  await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
}

//

//

//

//

//
//

//

//

//

//
//

//

//

//

//

export async function triggerAIMove(matchId: number, aiId: string) {
  const { data: match } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (!match?.gameState) return

  const gs = match.gameState
  const hand = gs.hands?.[aiId] ?? []

  if (!hand.length) {
    await pickFromMarket({ matchId, userId: aiId })
    return
  }

  // STACK TWO? Must resolve first
  if (gs.stackedTwo > 0) {
    await pickFromMarket({ matchId, userId: aiId })
    return
  }

  // Is AI awaiting shape choice (from WHOT)?
  if (gs.awaitingShapeChoice === aiId) {
    const shapes = ['circle', 'triangle', 'cross', 'square', 'star']
    const chosen = shapes[Math.floor(Math.random() * shapes.length)]
    await chooseWhotShape({ matchId, userId: aiId, shape: chosen as ShapeType })
    return
  }

  const top = gs.discardTop
  const playable = hand.find(
    (c) =>
      c.num === 20 || // WHOT always playable
      c.num === top?.num ||
      c.shape === top?.shape
  )

  if (playable) {
    await playMove({ matchId, userId: aiId, card: playable })
  } else {
    await pickFromMarket({ matchId, userId: aiId })
  }
}
