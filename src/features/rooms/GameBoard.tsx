import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMatch, getMatchPlayers } from '../../services/apiJoinOrCreateMatch'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'
import { useUser } from '../auth/useUser'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useStartGame } from './useStartGame'
import {
  chooseWhotShape,
  pickFromMarket,
  playMove,
  resolveStackedTwo
} from '../../services/apiGameService'
import ChooseShapeModal from './ChooseShapeModal'
import WinnerScreen from './WinnerScreen'
import PlayerBubble from './PlayerBubble'
import { Card } from './Card'
import CircularTimer from './CircularTimer'
import { useTurnTimer } from './useTurnTimer'

interface Player {
  id: string
  userId: string
  created_at: string
}

interface Profile {
  id: string
  username: string
  avatar: string
}

interface Card {
  id: string
  num: number
  shape: string
}

interface Match {
  id: number
  roomId: number | null
  status: string
  maxPlayers: number
  startedAt: string | null
  endedAt: string | null
  entryFee: number
  prize: number
  gameState: any
}

export default function GameBoard() {
  const { matchId } = useParams()
  const { user } = useUser()
  const { startGame, isStarting } = useStartGame()

  // states
  const [match, setMatch] = useState<Match | null>(null)
  const [me, setMe] = useState<string>('')

  const [players, setPlayers] = useState<Player[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [hand, setHand] = useState<Card[]>([]) //players card
  const [topCard, setTopCard] = useState<Card | null>(null) // discard pile top

  const gameState = match?.gameState
  const deckCount = gameState?.deck?.length ?? 0
  const awaitingShape = gameState?.awaitingShapeChoice

  const { timeLeft } = useTurnTimer(Number(matchId) || 0, gameState || {}, me)

  useEffect(() => {
    if (user) {
      setMe(user.id)
    }
  }, [user])

  // ----------------------------
  // FETCH MATCH + PLAYERS
  // ----------------------------

  useEffect(() => {
    async function load() {
      const matchData = await getMatch(Number(matchId))
      setMatch(matchData)
      console.log('GameBoard setMatch:', matchData)

      const matchPlayers = await getMatchPlayers(Number(matchId))
      setPlayers(matchPlayers)

      // fetch the game back exactly as is
      if (matchData.gameState) {
        const gs = matchData.gameState
        if (gs.discardTop) setTopCard(gs.discardTop)
        if (user) setHand(gs.hands?.[user.id] ?? [])
      }

      // Fetch each player's profile
      const ids = matchPlayers.map((p) => p.userId)

      const { data: profs, error } = await supabase.from('profiles').select('*').in('userId', ids)

      if (error) {
        console.error(error)
        return
      }

      const map: Record<string, any> = {}
      profs.forEach((p) => {
        map[p.userId] = p
      })

      setProfiles(map)
    }

    load()
  }, [matchId, user])

  // ----------------------------
  // CARD CLICK HANDLER
  // ----------------------------
  async function playCard(card) {
    if (!matchId || !me) return

    //  1. If PICK TWO is active and player didn't play a "2", resolve it
    if (match?.gameState?.stackedTwo && card.num !== 2) {
      try {
        await resolveStackedTwo({
          matchId: Number(matchId),
          userId: me
        })
      } catch (err) {
        toast.error(err.message)
      }
      return
    }

    // 🔥 Required shape enforcement (WHOT)
    const requiredShape = gameState?.requiredShape

    // WHOT mode check
    if (requiredShape) {
      if (card.shape !== gameState.requiredShape && card.num !== 20) {
        toast.error(`You must play a ${requiredShape} card or WHOT`)
        console.log(gameState)
        return
      }
    }

    try {
      await playMove({
        matchId: Number(matchId),
        userId: me,
        card
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  // ----------------------------
  // DYNAMIC PLAYER POSITIONS
  // ----------------------------
  function getPositionStyle(index, total) {
    if (total === 1) {
      return 'bottom-6 left-1/2 -translate-x-1/2' // only you alone
    }

    if (total === 2) {
      return index === 0 ? 'bottom-6 left-1/2 -translate-x-1/2' : 'top-6 left-1/2 -translate-x-1/2'
    }

    if (total === 3) {
      if (index === 0) return 'bottom-6 left-1/2 -translate-x-1/2'
      if (index === 1) return 'top-6 left-1/2 -translate-x-1/2'
      return 'left-6 top-1/2 -translate-y-1/2'
    }

    if (total === 4) {
      if (index === 0) return 'bottom-6 left-1/2 -translate-x-1/2'
      if (index === 1) return 'top-6 left-1/2 -translate-x-1/2'
      if (index === 2) return 'right-6 top-1/2 -translate-y-1/2'
      return 'left-6 top-1/2 -translate-y-1/2'
    }

    return ''
  }

  // inside GameBoard return, before mapping players
  const orderedPlayers = [...players]
  orderedPlayers.sort((a, b) => {
    if (a.userId === me) return -1 // put me first
    if (b.userId === me) return 1
    return 0
  })

  // Realtime subscription to match.gameState changes
  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`public:matches:id=eq.${matchId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const newRow = payload.new
          const oldRow = payload.old
          if (!newRow) return

          // update match as you already do
          setMatch((prev) => ({ ...prev, ...newRow }))

          const newGS = newRow.gameState
          const oldGS = (oldRow as any)?.gameState

          // Update UI pieces you already do
          if (newGS) {
            if (newGS.discardTop) setTopCard(newGS.discardTop)
            if (me) setHand(newGS.hands?.[me] ?? [])
          }

          // If there is a lastAction and it changed, show toasts accordingly
          const oldActionId = oldGS?.lastAction?.id
          const newAction = newGS?.lastAction

          if (newAction && newAction.id !== oldActionId) {
            const actorName = profiles[newAction.actor]?.username ?? newAction.actor

            // handle types
            if (newAction.type === 'play') {
              const num = newAction.cardNum
              if (num === 1) {
                toast(`${actorName} played HOLD ON, they keep the turn.`)
              } else if (num === 2) {
                const targetId = newAction.target
                const targetName = profiles[targetId]?.username ?? targetId
                // everyone notification
                toast(
                  `${actorName} played PICK TWO — ${targetName} must pick ${newAction.stackedTwo}`
                )
                // targeted (only show to the affected player)
                if (me === targetId) {
                  toast.error(`You must pick ${newAction.stackedTwo} cards`)
                }
              } else if (num === 8) {
                const skippedId = newAction.target
                const skippedName = profiles[skippedId]?.username ?? skippedId
                toast(`${actorName} played SUSPENSION, ${skippedName?.toUpperCase()} was skipped`)
                if (me === skippedId) {
                  toast.error('You were suspended (skipped)')
                }
              } else if (num === 14) {
                toast(`${actorName} played GENERAL MARKET. 1 card for everyone!`)
              } else if (num === 20) {
                // WHOT played; the player will choose a shape next
                toast(`${actorName} played WHOT — waiting for shape choice`)
              }
            } else if (newAction.type === 'chooseShape') {
              toast(`${actorName} chose ${newAction.shape?.toUpperCase()}`)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, me, profiles])

  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`matchPlayers:matchId=${matchId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matchPlayers', filter: `matchId=eq.${matchId}` },
        async () => {
          const updated = await getMatchPlayers(Number(matchId))
          setPlayers(updated)

          // NEW CODE: refresh profiles of all players
          const ids = updated.map((p) => p.userId)

          const { data: profs, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('userId', ids)

          if (profileError) throw new Error(profileError.message)

          const map: Record<string, any> = {}
          profs.forEach((p) => (map[p.userId] = p))
          setProfiles(map)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  // ============================================
  // 🚀 NEW: START GAME LOGIC
  // ============================================
  // AUTO START GAME WHEN FULL
  useEffect(() => {
    if (!match) return

    const allSeated = players.length === match.maxPlayers
    if (!allSeated) return

    if (match.gameState) return

    startGame(Number(matchId))
  }, [match, matchId, players.length, startGame])

  //  Prevent crash when gameState is not ready
  if (!match || !match.gameState) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-white">
        <div>Waiting for other player(s)</div>
        <div>Loading game...</div>
      </div>
    )
  }

  if (gameState.finished || gameState.status === 'finished') {
    const winnerId = gameState.winner!
    console.log(match)

    const winnerProfile = profiles[winnerId]
    return (
      <WinnerScreen
        winnerId={winnerId}
        winnerName={winnerProfile?.username ?? 'Player'}
        winnerAvatar={winnerProfile?.avatar ?? undefined}
        playerIds={gameState.playerOrder}
        prizeAmount={match?.prize}
        matchId={match?.id}
      />
    )
  }

  if (isStarting) return <span>Starting game .....</span>

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0e0f1a] text-white">
      {/* PLAYER POSITIONS */}
      <div className="pointer-events-none absolute inset-0">
        {orderedPlayers.map((p, i) => (
          <PlayerBubble
            key={p.userId}
            username={profiles[p.userId]?.username}
            avatar={profiles[p.userId]?.avatar}
            className={`absolute ${getPositionStyle(i, orderedPlayers.length)}`}
            isTurn={gameState.turn === p.userId}
            cardCount={gameState.hands?.[p.userId]?.length ?? 0}
            isMe={p.userId === me}
          />
        ))}
      </div>

      {/* CENTER AREA (Deck + Discard) */}
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6">
        {/* Deck */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
            <div className="h-64 w-64 rounded-full border-8 border-yellow-400" />
          </div>

          <div className="z-10 flex items-center gap-8 md:gap-16">
            {/* Deck (Market) */}
            <div className="group relative">
              {deckCount > 3 && (
                <>
                  <div className="absolute top-0 left-0 h-36 w-24 translate-x-2 translate-y-2 transform rounded-lg border border-white/20 bg-red-900 md:h-48 md:w-32" />
                  <div className="absolute top-0 left-0 h-36 w-24 translate-x-1 translate-y-1 transform rounded-lg border border-white/20 bg-red-800 md:h-48 md:w-32" />
                </>
              )}
              <Card
                isFaceDown
                onClick={async () => {
                  try {
                    const matchIdNumber = Number(matchId)
                    if (!matchIdNumber) return
                    if (!me) return

                    await pickFromMarket({ matchId: matchIdNumber, userId: me })
                  } catch (err) {
                    if (err instanceof Error) {
                      toast.error(err.message)
                    } else {
                      toast.error('Something went wrong')
                    }
                  }
                }}
                className="h-36 w-24 cursor-pointer transition-transform duration-200 hover:-translate-y-2 md:h-48 md:w-32"
              />

              <div className="absolute -top-3 -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-purple-800 font-bold text-white shadow-lg">
                {deckCount}
              </div>

              <div className="text-shadow absolute -bottom-8 w-full text-center font-bold text-white">
                Market
              </div>
            </div>

            {/* Discard Pile */}
            <div className="relative">
              {topCard ? (
                <Card
                  num={topCard.num}
                  shape={topCard.shape}
                  className="h-36 w-24 rotate-2 transform md:h-48 md:w-32"
                />
              ) : (
                <div className="flex h-36 w-24 items-center justify-center rounded-lg border-2 border-dashed border-white/30 text-white/50 md:h-48 md:w-32">
                  Empty
                </div>
              )}
            </div>
          </div>

          {/* Turn Timer */}
          {(gameState?.turn === me || awaitingShape === me) && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-30 transform">
              <CircularTimer timeLeft={timeLeft} total={20} />
            </div>
          )}
        </div>
      </div>

      {/* USER HAND */}
      <div className="absolute right-0 bottom-2 left-0 px-2">
        <div className="no-scrollbar flex w-full items-center justify-center gap-2 overflow-x-scroll pb-2">
          {hand.map((c) => (
            <Card
              key={c.id}
              num={c.num}
              shape={c.shape}
              onClick={() => playCard(c)}
              className="h-36 w-24 shrink-0 rotate-0 transform md:h-48 md:w-32"
            />
          ))}
        </div>
      </div>

      {/* Choose Shape Modal Overlay */}
      {awaitingShape === me && (
        <ChooseShapeModal
          onPick={async (shape) => {
            try {
              await chooseWhotShape({
                matchId: Number(matchId),
                userId: me,
                shape
              })
            } catch (err) {
              toast.error(err.message)
            }
          }}
        />
      )}
    </div>
  )
}
