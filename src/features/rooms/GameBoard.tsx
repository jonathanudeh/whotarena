import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../auth/useUser'
import { useStartGame } from './useStartGame'
import { useTurnTimer } from './useTurnTimer'
import { useGameData } from './hooks/useGameData'
import { useGameRealtime } from './hooks/useGameRealtime'
import { useGameActions } from './hooks/useGameActions'
import { maybeAddAIPlayers } from '../../services/apiJoinOrCreateMatch'
import { triggerAIMove } from '../../services/apiGameService'
import { getPlayerKey, getPlayerIdentity } from './components/playerHelpers'

import WinnerScreen from './WinnerScreen'
import ChooseShapeModal from './ChooseShapeModal'
import DeckAndDiscard from './components/GameArea/DeckAndDiscard'
import PlayerHand from './components/GameArea/PlayerHand'
import SpinnerMini from '../../components/SpinnerMini'
import PlayerPositions from './components/PlayerPosition'
import type { GameState } from './types'

export default function GameBoard() {
  const navigate = useNavigate()
  const { matchId } = useParams<{ matchId: string }>()
  const { user } = useUser()
  const { startGame, isStarting } = useStartGame()

  const userId = user?.id ?? ''

  // Data management
  const {
    match,
    players,
    profiles,
    hand,
    topCard,
    setMatch,
    setPlayers,
    setProfiles,
    setHand,
    setTopCard
  } = useGameData(matchId, userId)

  // Realtime subscriptions
  useGameRealtime({
    matchId,
    userId,
    profiles,
    setMatch,
    setPlayers,
    setProfiles,
    setHand,
    setTopCard
  })

  // Game actions
  const gameState = match?.gameState ?? null

  // Redirection to lobby
  useEffect(() => {
    if (!match || !gameState) return

    if (gameState.finished || gameState.status === 'finished') {
      const t = setTimeout(() => {
        navigate('/lobby', { replace: true })
      }, 5000)

      return () => clearTimeout(t)
    }
  }, [gameState, match, navigate])

  const { handlePlayCard, handleChooseShape } = useGameActions({
    matchId: Number(matchId),
    userId,
    gameState
  })

  // Turn timer
  const { timeLeft } = useTurnTimer(Number(matchId) || 0, gameState ?? ({} as GameState), userId)

  // Auto-start game when full
  useEffect(() => {
    if (!match || !matchId) return

    const allSeated = players.length === match.maxPlayers
    if (!allSeated || match.gameState) return

    startGame(Number(matchId))
  }, [match, matchId, players.length, startGame])

  // AI fill timeout
  useEffect(() => {
    if (!match || !matchId) return
    if (match.status !== 'waiting') return
    if (players.length >= match.maxPlayers) return
    if (match.gameState) return

    const AI_WAIT_TIME = 20000

    const timeout = setTimeout(() => {
      if (match.status !== 'waiting') return
      if (players.length >= match.maxPlayers) return

      maybeAddAIPlayers(Number(matchId))
    }, AI_WAIT_TIME)

    return () => clearTimeout(timeout)
  }, [match, matchId, players.length])

  // AI move trigger
  useEffect(() => {
    if (!match || !gameState) return
    if (!gameState.deck || gameState.deck.length === 0) return

    const currentPlayerMeta = gameState.playerMeta?.[gameState.turn]
    if (!currentPlayerMeta || currentPlayerMeta.type !== 'ai') return

    if (gameState.awaitingShapeChoice && gameState.awaitingShapeChoice !== gameState.turn) {
      return
    }

    const timer = setTimeout(() => {
      triggerAIMove(Number(match.id), gameState.turn)
    }, 4300)

    return () => clearTimeout(timer)
  }, [gameState, match, players])

  // Loading state
  if (!match || !gameState) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-white">
        <div>Waiting for other player(s)</div>
        <div>Loading game...</div>
        <SpinnerMini />
      </div>
    )
  }

  // Winner screen
  if (gameState.finished || gameState.status === 'finished') {
    const winnerId = gameState.winner!
    const winnerPlayer = players.find((p) => getPlayerKey(p) === winnerId)
    const winnerData = winnerPlayer
      ? getPlayerIdentity(winnerPlayer, profiles)
      : { name: 'Player', avatar: undefined }

    return (
      <WinnerScreen
        winnerId={winnerId}
        winnerName={winnerData.name ?? 'Player'}
        winnerAvatar={winnerData.avatar}
        playerIds={gameState.playerOrder}
        prizeAmount={match.prize}
        matchId={match.id}
      />
    )
  }

  if (isStarting) return <SpinnerMini />

  const deckCount = gameState.deck?.length ?? 0
  const awaitingShape = gameState.awaitingShapeChoice
  const showTimer = gameState.turn === userId || awaitingShape === userId

  return (
    <div className="bg-background relative h-dvh w-full overflow-hidden text-white">
      {/* Player Positions */}
      <PlayerPositions
        players={players}
        profiles={profiles}
        gameState={gameState}
        currentUserId={userId}
      />

      {/* Deck and Discard Area */}
      <DeckAndDiscard
        matchId={Number(matchId)}
        userId={userId}
        deckCount={deckCount}
        topCard={topCard}
        showTimer={showTimer}
        timeLeft={timeLeft}
      />

      {/* Player's Hand */}
      <PlayerHand hand={hand} onCardClick={handlePlayCard} />

      {/* Shape Selection Modal */}
      {awaitingShape === userId && <ChooseShapeModal onPick={handleChooseShape} />}
    </div>
  )
}

//

/*




































*/

//

//

// import { useEffect, useMemo, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { getMatch, getMatchPlayers, maybeAddAIPlayers } from '../../services/apiJoinOrCreateMatch'
// import { supabase } from '../../services/supabase'
// import toast from 'react-hot-toast'
// import { useUser } from '../auth/useUser'
// import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
// import { useStartGame } from './useStartGame'
// import {
//   chooseWhotShape,
//   pickFromMarket,
//   playMove,
//   resolveStackedTwo,
//   triggerAIMove,
//   triggerAIShapeChoice
// } from '../../services/apiGameService'
// import ChooseShapeModal from './ChooseShapeModal'
// import WinnerScreen from './WinnerScreen'
// import PlayerBubble from './PlayerBubble'
// import { Card } from './CardComponent'
// import CircularTimer from './CircularTimer'
// import { useTurnTimer } from './useTurnTimer'
// import SpinnerMini from '../../components/SpinnerMini'

// interface Player {
//   id: string
//   userId: string
//   created_at: string
//   playerType: 'human' | 'ai'
//   displayName?: string
//   avatarUrl?: string
// }

// interface Profile {
//   id: string
//   username: string
//   avatar: string
// }

// interface Card {
//   id: string
//   num: number
//   shape: string
// }

// interface Match {
//   id: number
//   roomId: number | null
//   status: string
//   maxPlayers: number
//   startedAt: string | null
//   endedAt: string | null
//   entryFee: number
//   prize: number
//   gameState: any
// }

// export default function GameBoard() {
//   const { matchId } = useParams()
//   const { user } = useUser()
//   const { startGame, isStarting } = useStartGame()

//   // states
//   const [match, setMatch] = useState<Match | null>(null)
//   const [me, setMe] = useState<string>('')
//   const [players, setPlayers] = useState<Player[]>([])
//   const [profiles, setProfiles] = useState<Record<string, Profile>>({})
//   const [hand, setHand] = useState<Card[]>([]) //players card
//   const [topCard, setTopCard] = useState<Card | null>(null) // discard pile top

//   const gameState = match?.gameState
//   const deckCount = gameState?.deck?.length ?? 0
//   const awaitingShape = gameState?.awaitingShapeChoice

//   const { timeLeft } = useTurnTimer(Number(matchId) || 0, gameState || {}, me)

//   useEffect(() => {
//     if (user) {
//       setMe(user.id)
//     }
//   }, [user])

//   // ----------------------------
//   // FETCH MATCH + PLAYERS
//   // ----------------------------

//   useEffect(() => {
//     async function load() {
//       const matchData = await getMatch(Number(matchId))
//       setMatch(matchData)

//       const matchPlayers = await getMatchPlayers(Number(matchId))
//       setPlayers(matchPlayers)

//       // fetch the game back exactly as is
//       if (matchData.gameState) {
//         const gs = matchData.gameState
//         if (gs.discardTop) setTopCard(gs.discardTop)
//         if (user) setHand(gs.hands?.[user.id] ?? [])
//       }

//       // Fetch each player's profile
//       const ids = matchPlayers.map((p) => p.userId).filter((id): id is string => !!id)

//       const { data: profs, error } = await supabase.from('profiles').select('*').in('userId', ids)

//       if (error) {
//         console.error(error)
//         return
//       }

//       const map: Record<string, any> = {}
//       profs.forEach((p) => {
//         map[p.userId] = p
//       })

//       setProfiles(map)
//     }

//     load()
//   }, [matchId, user])

//   // ----------------------------
//   // CARD CLICK HANDLER
//   // ----------------------------
//   async function playCard(card) {
//     if (!matchId || !me) return

//     if (gameState.turn === undefined || gameState.turn !== me) {
//       toast.error("It's not you turn")
//       return
//     }

//     console.log(`play card func`)

//     //  1. If PICK TWO is active and player didn't play a "2", resolve it

//     if (match?.gameState?.stackedTwo && card.num !== 2) {
//       try {
//         await resolveStackedTwo({
//           matchId: Number(matchId),
//           userId: me
//         })
//       } catch (err) {
//         toast.error(err.message)
//       }
//       return
//     }

//     // Required shape enforcement (WHOT)
//     const requiredShape = gameState?.requiredShape

//     // WHOT mode check
//     if (requiredShape) {
//       if (card.shape !== gameState.requiredShape && card.num !== 20) {
//         toast.error(`You must play a ${requiredShape} card or WHOT`)
//         console.log(gameState)
//         return
//       }
//     }

//     try {
//       await playMove({
//         matchId: Number(matchId),
//         userId: me,
//         card
//       })
//     } catch (err) {
//       toast.error(err.message)
//     }
//   }

//   // Memoize the ordered players WITH their identity data
//   const orderedPlayersWithData = useMemo(() => {
//     const ordered = [...players]
//     ordered.sort((a, b) => {
//       if (a.userId === me) return -1
//       if (b.userId === me) return 1
//       return 0
//     })

//     // Map to include the data we need, so we don't recreate objects in render
//     return ordered.map((p) => ({
//       player: p,
//       key: getPlayerKey(p),
//       identity: getPlayerIdentity(p, profiles)
//     }))
//   }, [players, me, profiles]) // Only recalculate when players or me changes

//   // Realtime subscription to match.gameState changes
//   useEffect(() => {
//     if (!matchId) return

//     const channel = supabase
//       .channel(`public:matches:id=eq.${matchId}`)
//       .on(
//         'postgres_changes',
//         { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
//         (payload: RealtimePostgresChangesPayload<any>) => {
//           const newRow = payload.new
//           const oldRow = payload.old
//           if (!newRow) return

//           // update match
//           setMatch((prev) => ({ ...prev, ...newRow }))

//           const newGS = newRow.gameState
//           const oldGS = (oldRow as any)?.gameState

//           // Update UI pieces
//           if (newGS) {
//             if (newGS.discardTop) setTopCard(newGS.discardTop)
//             if (me) setHand(newGS.hands?.[me] ?? [])
//           }

//           // If there is a lastAction and it changed, show toasts accordingly
//           const oldActionId = oldGS?.lastAction?.id
//           const newAction = newGS?.lastAction

//           if (newAction && newAction.id !== oldActionId) {
//             const actorName = profiles[newAction.actor]?.username ?? 'player'

//             // handle types
//             if (newAction.type === 'play') {
//               const num = newAction.cardNum
//               if (num === 1) {
//                 toast.dismissAll()
//                 toast(`${actorName} played HOLD ON, they keep the turn.`)
//               } else if (num === 2) {
//                 const targetId = newAction.target
//                 const targetName = profiles[targetId]?.username ?? targetId
//                 // everyone notification
//                 toast.dismissAll()
//                 toast(
//                   `${actorName} played PICK TWO — ${targetName} must pick ${newAction.stackedTwo}`
//                 )
//                 // targeted (only show to the affected player)
//                 if (me === targetId) {
//                   toast.dismissAll()
//                   toast.error(`You must pick ${newAction.stackedTwo} cards`)
//                 }
//               } else if (num === 8) {
//                 const skippedId = newAction.target
//                 const skippedName = profiles[skippedId]?.username ?? skippedId
//                 toast.dismissAll()
//                 toast(`${actorName} played SUSPENSION, ${skippedName?.toUpperCase()} was skipped`)
//                 if (me === skippedId) {
//                   toast.error('You were suspended (skipped)')
//                 }
//               } else if (num === 14) {
//                 toast.dismissAll()
//                 toast(`${actorName} played GENERAL MARKET. 1 card for everyone!`)
//               } else if (num === 20) {
//                 // WHOT played; the player will choose a shape next
//                 toast(`${actorName} played WHOT — waiting for shape choice`)
//               }
//             } else if (newAction.type === 'chooseShape') {
//               toast(`${actorName} chose ${newAction.shape?.toUpperCase()}`)
//             }
//           }
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [matchId, me, profiles])

//   useEffect(() => {
//     if (!matchId) return

//     const channel = supabase
//       .channel(`matchPlayers:matchId=${matchId}`)
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'matchPlayers', filter: `matchId=eq.${matchId}` },
//         async () => {
//           const updated = await getMatchPlayers(Number(matchId))
//           setPlayers(updated)

//           // refresh profiles of all players
//           const ids = updated.map((p) => p.userId).filter((id): id is string => !!id)

//           const { data: profs, error: profileError } = await supabase
//             .from('profiles')
//             .select('*')
//             .in('userId', ids)

//           if (profileError) throw new Error(profileError.message)

//           const map: Record<string, any> = {}
//           profs.forEach((p) => (map[p.userId] = p))
//           setProfiles(map)
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [matchId])

//   // NEW: START GAME LOGIC
//   // AUTO START GAME WHEN FULL
//   useEffect(() => {
//     if (!match) return

//     const allSeated = players.length === match.maxPlayers
//     if (!allSeated) return

//     if (match.gameState) return

//     startGame(Number(matchId))
//   }, [match, matchId, players.length, startGame])

//   //  AI FILL WHEN WAITING TOO LONG
//   useEffect(() => {
//     if (!match) return

//     // only care about waiting state
//     if (match.status !== 'waiting') return

//     // already full? do nothing
//     if (players.length >= match.maxPlayers) return

//     // game already initialized? bail
//     if (match.gameState) return

//     const AI_WAIT_TIME = 20000 // 20secs

//     const timeout = setTimeout(() => {
//       // last safety check before calling server
//       if (match.status !== 'waiting') return
//       if (players.length >= match.maxPlayers) return

//       maybeAddAIPlayers(Number(matchId))
//     }, AI_WAIT_TIME)

//     return () => {
//       clearTimeout(timeout)
//     }
//   }, [match, matchId, players.length])

//   useEffect(() => {
//     if (!match || !gameState) return

//     if (!gameState.deck || gameState.deck.length === 0) {
//       return
//     }

//     const currentPlayerMeta = gameState.playerMeta[gameState.turn]
//     if (!currentPlayerMeta || currentPlayerMeta.type !== 'ai') return
//     if (gameState.awaitingShapeChoice && gameState.awaitingShapeChoice !== gameState.turn) {
//       return
//     }

//     const timer = setTimeout(() => {
//       triggerAIMove(Number(match.id), gameState.turn)
//     }, 5200)

//     return () => clearTimeout(timer)
//   }, [gameState, match, players])

//   //  Prevent crash when gameState is not ready
//   if (!match || !match.gameState) {
//     return (
//       <div className="flex h-screen w-full flex-col items-center justify-center text-white">
//         <div>Waiting for other player(s)</div>
//         <div>Loading game...</div>
//       </div>
//     )
//   }

//   if (gameState.finished || gameState.status === 'finished') {
//     const winnerId = gameState.winner!
//     // find winner in players array, both human or player
//     const winnerPlayer = players.find((p) => getPlayerKey(p) === winnerId)

//     // Get winner details using the same logic as PlayerBubble
//     const winnerData = winnerPlayer
//       ? getPlayerIdentity(winnerPlayer, profiles)
//       : { name: 'Player', avatar: undefined }

//     return (
//       <WinnerScreen
//         winnerId={winnerId}
//         winnerName={winnerData.name ?? 'Player'}
//         winnerAvatar={winnerData.avatar}
//         playerIds={gameState.playerOrder}
//         prizeAmount={match?.prize}
//         matchId={match?.id}
//       />
//     )
//   }

//   if (isStarting) return <SpinnerMini />

//   return (
//     <div className="relative h-dvh w-full overflow-hidden bg-[#0e0f1a] text-white">
//       {/* PLAYER POSITIONS */}
//       <div className="pointer-events-none absolute inset-0">
//         {orderedPlayersWithData.map((playerData, i) => {
//           const { player, key: playerKey, identity } = playerData

//           return (
//             <PlayerBubble
//               key={playerKey}
//               username={identity.name}
//               avatar={identity.avatar}
//               className={`absolute ${getPositionStyle(i, orderedPlayersWithData.length)}`}
//               isTurn={gameState.turn === playerKey}
//               cardCount={gameState.hands?.[playerKey]?.length ?? 0}
//               isMe={playerKey === me}
//             />
//           )
//         })}
//       </div>

//       {/* CENTER AREA (Deck + Discard) */}
//       <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6">
//         {/* Deck */}
//         <div className="relative flex flex-1 items-center justify-center">
//           <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
//             <div className="h-64 w-64 rounded-full border-8 border-yellow-400" />
//           </div>

//           <div className="z-10 flex items-center gap-8 md:gap-16">
//             {/* Deck (Market) */}
//             <div className="group relative">
//               {deckCount > 3 && (
//                 <>
//                   <div className="absolute top-0 left-0 h-36 w-24 translate-x-2 translate-y-2 transform rounded-lg border border-white/20 bg-red-900 md:h-48 md:w-32" />
//                   <div className="absolute top-0 left-0 h-36 w-24 translate-x-1 translate-y-1 transform rounded-lg border border-white/20 bg-red-800 md:h-48 md:w-32" />
//                 </>
//               )}
//               <Card
//                 isFaceDown
//                 onClick={async () => {
//                   try {
//                     const matchIdNumber = Number(matchId)
//                     if (!matchIdNumber) return
//                     if (!me) return

//                     await pickFromMarket({ matchId: matchIdNumber, userId: me })
//                   } catch (err) {
//                     if (err instanceof Error) {
//                       toast.error(err.message)
//                     } else {
//                       toast.error('Something went wrong')
//                     }
//                   }
//                 }}
//                 className="h-36 w-24 cursor-pointer transition-transform duration-200 hover:-translate-y-2 md:h-48 md:w-32"
//               />

//               <div className="absolute -top-3 -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-purple-800 font-bold text-white shadow-lg">
//                 {deckCount}
//               </div>

//               <div className="text-shadow absolute -bottom-8 w-full text-center font-bold text-white">
//                 Market
//               </div>
//             </div>

//             {/* Discard Pile */}
//             <div className="relative">
//               {topCard ? (
//                 <Card
//                   num={topCard.num}
//                   shape={topCard.shape}
//                   className="h-36 w-24 rotate-2 transform md:h-48 md:w-32"
//                 />
//               ) : (
//                 <div className="flex h-36 w-24 items-center justify-center rounded-lg border-2 border-dashed border-white/30 text-white/50 md:h-48 md:w-32">
//                   Empty
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Turn Timer */}
//           {(gameState?.turn === me || awaitingShape === me) && (
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-30 transform">
//               <CircularTimer timeLeft={timeLeft} total={30} />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* USER HAND */}
//       <div className="absolute right-0 bottom-2 left-0 px-2">
//         <div className="no-scrollbar flex w-full items-center justify-center gap-2 overflow-x-scroll pb-2">
//           {hand.map((c) => (
//             <Card
//               key={c.id}
//               num={c.num}
//               shape={c.shape}
//               onClick={() => playCard(c)}
//               className="h-36 w-24 shrink-0 rotate-0 transform md:h-48 md:w-32"
//             />
//           ))}
//         </div>
//       </div>

//       {/* Choose Shape Modal Overlay */}
//       {awaitingShape === me && (
//         <ChooseShapeModal
//           onPick={async (shape) => {
//             try {
//               await chooseWhotShape({
//                 matchId: Number(matchId),
//                 userId: me,
//                 shape
//               })
//             } catch (err) {
//               toast.error(err.message)
//             }
//           }}
//         />
//       )}
//     </div>
//   )
// }

// function getPlayerIdentity(player, profiles: Record<string, Profile>) {
//   if (!player.userId) {
//     // ai
//     return {
//       name: player.displayName,
//       avatar: player.avatarUrl
//     }
//   }

//   // human
//   return {
//     name: profiles[player.userId]?.username ?? 'Player',
//     avatar: profiles[player.userId]?.avatar
//   }
// }

// function getPlayerKey(player) {
//   return String(player.userId ?? player.id)
// }

// // ----------------------------
// // DYNAMIC PLAYER POSITIONS
// // ----------------------------
// function getPositionStyle(index: number, total: number) {
//   if (total === 1) {
//     return 'bottom-6 left-1/2 -translate-x-1/2' // only you alone
//   }

//   if (total === 2) {
//     return index === 0 ? 'bottom-6 left-1/2 -translate-x-1/2' : 'top-6 left-1/2 -translate-x-1/2'
//   }

//   if (total === 3) {
//     if (index === 0) return 'bottom-6 left-1/2 -translate-x-1/2'
//     if (index === 1) return 'top-6 left-1/2 -translate-x-1/2'
//     return 'left-6 top-1/2 -translate-y-1/2'
//   }

//   if (total === 4) {
//     if (index === 0) return 'bottom-6 left-1/2 -translate-x-1/2'
//     if (index === 1) return 'top-6 left-1/2 -translate-x-1/2'
//     if (index === 2) return 'right-6 top-1/2 -translate-y-1/2'
//     return 'left-6 top-1/2 -translate-y-1/2'
//   }

//   return ''
// }
