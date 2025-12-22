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
// function resolvePlayerId(gs: any, userId: string): string {
//   if (gs.playerMeta[userId]) return userId
//   const pid = Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
//   if (!pid) throw new Error(`Invalid playerId: ${userId}`)
//   return pid
// }

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
}) {
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

  if (matchErr || !match) throw new Error('Match not found')

  // 2. Load match players
  const { data: matchPlayers, error: playersErr } = await supabase
    .from('matchPlayers')
    .select('id, userId, created_at')
    .eq('matchId', matchId)
    .order('created_at', { ascending: true })

  if (playersErr || !matchPlayers?.length) {
    throw new Error('No players in match')
  }

  console.log(`starting game func`)

  // 3. Build & shuffle deck
  const deck = shuffle(buildWhotDeck())

  // 4. Runtime game structures (IMPORTANT)
  const hands: Record<string, Card[]> = {}
  const playerOrder: string[] = []
  const playerMeta: Record<string, { userId: string | null; type: 'human' | 'ai' }> = {}

  // 5. Create runtime playerIds FIRST
  for (const p of matchPlayers) {
    const playerId = String(p.userId ?? p.id)

    hands[playerId] = []
    playerOrder.push(playerId)

    playerMeta[playerId] = {
      userId: String(p.userId ?? p.id),
      type: p.userId ? 'human' : 'ai'
    }

    console.log({ playerMeta })
  }

  // DEBUG
  console.log('START GAME players:', playerOrder)

  // 6. Deal cards (round-robin, runtime IDs only)
  let deckCursor = 0

  for (let round = 0; round < cardCountPerPlayer; round++) {
    for (const playerId of playerOrder) {
      if (deckCursor >= deck.length) break
      hands[playerId].push(deck[deckCursor++])
    }
  }

  //  DEBUG
  console.log(
    'START GAME hands:',
    Object.fromEntries(Object.entries(hands).map(([k, v]) => [k, v.length]))
  )

  // 7. Discard top
  const discardTop = deckCursor < deck.length ? deck[deckCursor++] : null

  // 8. Remaining deck (market)
  const remainingDeck = deck.slice(deckCursor).reverse()

  // 9. First turn
  const firstPlayerId = playerOrder[0]

  // 10. Build gameState
  const gameState = {
    deck: remainingDeck,
    discardTop,
    hands,
    playerOrder,
    playerMeta,
    turn: firstPlayerId,
    turnIndex: 0,
    stackedTwo: 0,
    requiredShape: null,
    awaitingShapeChoice: null,
    awaitingShapeEndTime: null,
    skipped: null,
    lastAction: null,
    status: 'playing',
    finished: false,
    winner: null,
    turnEndTime: new Date(Date.now() + 20_000).toISOString(),
    createdAt: new Date().toISOString()
  }

  // 🔍 FINAL DEBUG
  console.log('GAMESTATE CREATED', gameState)

  // 11. Save
  const { error: updateErr } = await supabase
    .from('matches')
    .update({
      gameState,
      status: 'playing',
      startedAt: new Date().toISOString()
    })
    .eq('id', matchId)

  if (updateErr) throw updateErr

  return { success: true }
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

  // logState(gs, 'playMove start')

  console.log(`play move func`)

  //  EARLY DECK EMPTY WIN CHECK
  if (gs.deck.length === 0 && !gs.finished) {
    const winner = getWinnerFromTotals(gs)
    gs.winner = winner
    gs.finished = true
    gs.status = 'finished'

    await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
    return true
  }

  // const playerId = resolvePlayerId(gs, userId)

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

  // PICK TWO BLOCK
  if (gs.stackedTwo > 0 && card.num !== 2) throw new Error('You must pick your stacked 2s')

  // Remove card from hand
  const playerId = userId
  //  Object.keys(gs.playerMeta).includes(userId)
  //  // ? userId
  //   : Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)

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
    // if there's a required shape, then the ai should either play a whot or the shape or go to market to make requiredshape null

    if (card.num !== 20 && card.shape !== gs.requiredShape) {
      throw new Error(`You must play a ${gs.requiredShape} card or WHOT`)
    }

    // reset only when a non-WHOT satisfies it (or allow clearing on WHOT since awaitingShapeChoice will set new)
    if (card.num !== 20 && card.shape === gs.requiredShape) {
      gs.requiredShape = null
    }
  }

  // ---------------- SPECIAL CARDS ----------------
  if (card.num === 1) {
    // hold turn
    gs.turnIndex = currentIndex
  } else if (card.num === 2) {
    gs.stackedTwo = (gs.stackedTwo ?? 0) + 2
    gs.turnIndex = (currentIndex + 1) % players.length
  } else if (card.num === 8) {
    gs.skipped = players[(currentIndex + 1) % players.length]
    gs.turnIndex = (currentIndex + 2) % players.length
  } else if (card.num === 14) {
    // GENERAL MARKET
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
    gs.awaitingShapeChoice = playerId
    gs.awaitingShapeEndTime = new Date(Date.now() + 20 * 1000).toISOString()
    gs.turnIndex = currentIndex
  } else {
    gs.turnIndex = (currentIndex + 1) % players.length
  }

  // Check for win
  if (gs.hands[playerId].length === 0) {
    gs.winner = playerId
    gs.finished = true
    gs.status = 'finished'
  }

  gs.turn = players[gs.turnIndex]
  if (!gs.finished && !gs.awaitingShapeChoice) {
    gs.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()
  }

  // lastAction
  gs.lastAction = {
    id: `${Date.now()}-${playerId}`,
    type: 'play',
    actor: playerId,
    cardNum: card.num,
    cardShape: card.shape ?? null,
    stackedTwo: gs.stackedTwo ?? 0,
    target: card.num === 2 || card.num === 8 ? players[(currentIndex + 1) % players.length] : null,
    createdAt: new Date().toISOString()
  }

  await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
  logState(gs, 'playMove end')
  return true
}

export async function pickFromMarket({ matchId, userId }: { matchId: number; userId: string }) {
  const { data: match } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (!match) return

  const gs = match.gameState
  if (!gs) throw new Error('Game not started')

  logState(gs, 'pickFromMarket start')

  console.log(`pick from market func `)

  const playerId = userId

  if (!playerId) throw new Error(`Invalid playerId: ${userId}`)

  if (gs.stackedTwo && gs.stackedTwo > 0) {
    await resolveStackedTwo({ matchId, userId: playerId })
    return
  }

  if (gs.turn !== playerId) throw new Error('Not your turn')

  if (!gs.deck || gs.deck.length === 0) throw new Error('Market empty')

  // draw the card
  const newCard = gs.deck.pop()
  if (newCard) gs.hands[playerId].push(newCard!)

  // right here check if deck is empty AFTER drawing
  if (gs.deck.length === 0 && !gs.finished) {
    const winner = getWinnerFromTotals(gs)
    gs.winner = winner
    gs.finished = true
    gs.status = 'finished'

    await supabase
      .from('matches')
      .update({ gameState: gs, status: 'ended', endedAt: new Date().toISOString() })
      .eq('id', matchId)

    return true
  }

  // Advance turn
  const players = gs.playerOrder
  gs.turnIndex = (players.indexOf(playerId) + 1) % players.length
  gs.turn = players[gs.turnIndex]
  gs.turnEndTime = new Date(Date.now() + 20 * 1000).toISOString()

  await supabase.from('matches').update({ gameState: gs }).eq('id', matchId)
  logState(gs, 'pickFromMarket end')
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

  const playerId = userId
  // gs.playerMeta[userId]
  // //   ? Object.keys(gs.playerMeta).find((k) => gs.playerMeta[k].userId === userId)
  //   : userId

  if (gs.awaitingShapeChoice !== playerId) {
    throw new Error('Not awaiting your choice')
  }

  console.log(`choose whot shape func `)

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

  console.log(`resolce pick 2s `)

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

function isUUID(id: string) {
  console.log(`isUUID check `)
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
}

export async function updateMatchResults(
  winnerId: string,
  playerIds: string[],
  matchId: number
): Promise<{ ok: true }> {
  // Validate and sanitize
  // const validatedWinner = typeof winnerId === 'string' && winnerId.trim() !== '' ? winnerId : null
  // const validatedPlayers = Array.isArray(playerIds)
  //   ? playerIds.filter((id) => typeof id === 'string' && id.trim() !== '')
  //   : []

  // if (!validatedWinner) {
  //   console.warn('Skipping increment_profile_stats: invalid winnerId', winnerId)
  // } else {
  //   console.log('Calling increment_profile_stats', {
  //     winner_id: validatedWinner,
  //     player_ids: validatedPlayers
  //   })

  //   const { data, error } = await supabase.rpc('increment_profile_stats', {
  //     player_ids: validatedPlayers,
  //     winner_id: validatedWinner
  //   })

  //   if (error) {
  //     console.error('RPC error increment_profile_stats', error)
  //     throw error
  //   }

  //   console.log('increment_profile_stats success', data)

  //   const { error: updateErr } = await supabase
  //     .from('matches')
  //     .update({ status: 'ended', endedAt: new Date().toISOString() })
  //     .eq('id', matchId)
  //     .select()
  //     .single()

  //   if (updateErr) {
  //     console.error('Error updating match', updateErr)
  //     throw new Error(updateErr.message)
  //   }

  //   console.log('Match updated successfully')
  // }

  //  Only humans belong in DB
  const humanPlayerIds = playerIds.filter(isUUID)
  const humanWinnerId = isUUID(winnerId) ? winnerId : null

  console.log('Final match results payload:', {
    humanPlayerIds,
    humanWinnerId
  })

  // If NO humans exist → just end match
  if (humanPlayerIds.length === 0) {
    await supabase
      .from('matches')
      .update({ status: 'ended', endedAt: new Date().toISOString() })
      .eq('id', matchId)

    return { ok: true }
  }

  // Increment stats
  if (humanWinnerId) {
    const { error } = await supabase.rpc('increment_profile_stats', {
      player_ids: humanPlayerIds,
      winner_id: humanWinnerId
    })

    await supabase
      .from('matches')
      .update({ status: 'ended', endedAt: new Date().toISOString() })
      .eq('id', matchId)

    if (error) throw error
  }

  console.log(`match update `)

  // End match
  const { error: updateErr } = await supabase
    .from('matches')
    .update({ status: 'ended', endedAt: new Date().toISOString() })
    .eq('id', matchId)

  if (updateErr) throw updateErr

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

  console.log(`turn advance func `)

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

  // Not AI turn
  // if (gs.turn !== aiId) return

  // 1️⃣ Shape selection phase (ONLY this player can act)
  if (gs.awaitingShapeChoice) {
    if (gs.awaitingShapeChoice === aiId) {
      await triggerAIShapeChoice(matchId, aiId)
    }
    return
  }

  const hand = gs.hands[aiId] ?? []

  //  REQUIRED SHAPE PHASE (CRITICAL FIX)
  if (gs.requiredShape) {
    const card = hand.find((c) => c.shape === gs.requiredShape || c.num === 20)

    if (card) {
      await playMove({ matchId, userId: aiId, card })
    } else {
      await pickFromMarket({ matchId, userId: aiId })
    }
    return
  }

  // STACKED TWO
  if (gs.stackedTwo > 0) {
    await pickFromMarket({ matchId, userId: aiId })
    return
  }

  console.log(`Ai playtrigger `)

  //  NORMAL PLAY
  const top = gs.discardTop
  const playable = hand.find((c) => c.num === 20 || c.num === top?.num || c.shape === top?.shape)

  if (playable) {
    await playMove({ matchId, userId: aiId, card: playable })
  } else {
    await pickFromMarket({ matchId, userId: aiId })
  }
}

// export async function triggerAIMove(matchId: number, aiId: string) {
//   const { data: match } = await supabase
//     .from('matches')
//     .select('gameState')
//     .eq('id', matchId)
//     .single()

//   if (!match?.gameState) return
//   const gs = match.gameState

//   // shape choice locks the game
//   if (gs.awaitingShapeChoice && gs.awaitingShapeChoice !== aiId) {
//     return
//   }

//   // AI logic

//   // Shape choice ALWAYS has priority
//   if (gs.awaitingShapeChoice === aiId) {
//     await triggerAIShapeChoice(matchId, aiId)
//     return
//   }

//   //  Handle stacked two / empty
//   if (gs.stackedTwo > 0) {
//     await pickFromMarket({ matchId, userId: aiId })
//     return
//   }

//   const hand = gs.hands[aiId] ?? []

//   //  REQUIRED SHAPE LOGIC (THIS WAS MISSING)
//   if (gs.requiredShape) {
//     const shapeCard = hand.find((c) => c.shape === gs.requiredShape || c.num === 20)

//     if (shapeCard) {
//       await playMove({ matchId, userId: aiId, card: shapeCard })
//     } else {
//       await pickFromMarket({ matchId, userId: aiId })
//     }
//     return
//   }

//   const top = gs.discardTop
//   const playable = hand.find((c) => c.num === 20 || c.num === top?.num || c.shape === top?.shape)

//   if (playable) {
//     await playMove({ matchId, userId: aiId, card: playable })
//   } else {
//     await pickFromMarket({ matchId, userId: aiId })
//   }
// }

type CardChoice = {
  num: number
  shape: ShapeType
}

export async function triggerAIShapeChoice(matchId: number, playerId: string) {
  const { data: match } = await supabase
    .from('matches')
    .select('gameState')
    .eq('id', matchId)
    .single()

  if (!match?.gameState) return

  const gs = match.gameState
  const hand: CardChoice[] = gs.hands[playerId] ?? []

  const shapeCount: Record<ShapeType, number> = {
    circle: 0,
    triangle: 0,
    cross: 0,
    square: 0,
    star: 0
  }

  for (const card of hand) {
    // if (card.shape !== 'whot') {
    shapeCount[card.shape]++
    // }
  }

  let chosenShape: ShapeType | null = null
  let max = -1

  const shapes = Object.keys(shapeCount) as ShapeType[]

  for (const shape of shapes) {
    if (shapeCount[shape] > max) {
      max = shapeCount[shape]
      chosenShape = shape
    }
  }

  if (!chosenShape) {
    const fallback: ShapeType[] = ['circle', 'triangle', 'cross', 'square', 'star']
    chosenShape = fallback[Math.floor(Math.random() * fallback.length)]
  }

  console.log(`Ai shape choice `)

  await chooseWhotShape({ matchId, userId: playerId, shape: chosenShape })
}
