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

    // 🔥 1. If PICK TWO is active and player didn't play a "2", resolve it
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
    let requiredShape = gameState?.requiredShape

    // WHOT mode check
    if (gameState?.requiredShape) {
      if (card.shape !== gameState.requiredShape && card.num !== 20) {
        toast.error(`You must play a ${gameState.requiredShape} card or WHOT`)
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
          if (!newRow) return
          setMatch(newRow)

          const gs = newRow.gameState
          if (!gs) return

          // update relevant UI slices from gameState
          // set top card
          if (gs) {
            if (gs.discardTop) setTopCard(gs.discardTop)
            if (me) setHand(gs.hands?.[me] ?? [])
          }
          // update players map if needed (we keep playerCounts etc)
          // optional: you can also set deckCount or any other UI pieces from gs
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, me])

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

  // 🚨 Prevent crash when gameState is not ready
  if (!match || !match.gameState) {
    return (
      <div className="flex h-full w-full items-center justify-center text-white">
        Loading game...
      </div>
    )
  }

  if (awaitingShape === me) {
    return (
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
    )
  }

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
              <div className="absolute top-0 left-0 h-36 w-24 translate-x-2 translate-y-2 transform rounded-lg border border-white/20 bg-red-900 md:h-48 md:w-32" />
              <div className="absolute top-0 left-0 h-36 w-24 translate-x-1 translate-y-1 transform rounded-lg border border-white/20 bg-red-800 md:h-48 md:w-32" />

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
              className="h-36 w-24 rotate-0 transform md:h-48 md:w-32"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------
// UI COMPONENTS
// -----------------------------------------------------

function PlayerBubble({
  username,
  avatar,
  isTurn,
  cardCount,
  className
}: {
  username?: string
  avatar?: string
  className?: string
  isTurn?: boolean
  cardCount?: number
}) {
  return (
    <div className={`${className} z-50 flex flex-col items-center`}>
      <img
        src={avatar}
        className={`h-12 w-12 rounded-full object-cover ${
          isTurn ? 'border-2 border-green-500' : 'border-2 border-white/20'
        }`}
      />
      <p className="mt-1 text-xs">{username}</p>
      <p className="text-[10px] opacity-80">{cardCount} cards</p>
    </div>
  )
}

//

// --- SVG Shapes for Cards ---
const ShapeIcon = ({ shape, className }) => {
  const commonProps = {
    className: className,
    fill: 'currentColor',
    stroke: 'currentColor',
    strokeWidth: '0'
  }

  switch (shape.toLowerCase()) {
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    case 'square':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    case 'cross':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M20 9h-5V4h-6v5H4v6h5v5h6v-5h5v-6z" />
        </svg>
      )
    case 'whot':
      return <span className="font-serif text-2xl font-black text-[#8B0000] italic">WHOT</span>

    default:
      return null
  }
}

// --- Card Component ---
interface CardProps {
  num?: number
  shape?: string
  isFaceDown?: boolean
  onClick?: () => void // optional
  className?: string
  style?: React.CSSProperties
}

const Card: React.FC<CardProps> = ({
  num,
  shape,
  isFaceDown = false,
  onClick,
  className = '',
  style = {}
}) => {
  if (isFaceDown) {
    return (
      <div
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-white/20 bg-[#D32F2F] shadow-xl ${className}`}
        style={style}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-black to-transparent opacity-10" />
        <div className="flex flex-col items-center justify-center gap-1 opacity-90">
          <span
            className="rotate-180 font-serif text-3xl font-bold tracking-widest text-white"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Whot
          </span>
          <span
            className="font-serif text-3xl font-bold tracking-widest text-white"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Whot
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-2 shadow-xl ${className}`}
      style={style}
    >
      <div className="flex flex-col items-center self-start leading-none">
        <span className="text-xl font-bold text-[#8B0000]">{num}</span>
        <ShapeIcon shape={shape} className="h-4 w-4 text-[#8B0000]" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <ShapeIcon shape={shape} className="h-16 w-16 text-[#8B0000] md:h-20 md:w-20" />
      </div>
      <div className="flex rotate-180 transform flex-col items-center self-end leading-none">
        <span className="text-xl font-bold text-[#8B0000]">{num}</span>
        <ShapeIcon shape={shape} className="h-4 w-4 text-[#8B0000]" />
      </div>
    </div>
  )
}

// interface GameState {
//   hands: Record<string, Card[]>
//   deck: Card[]
//   discardTop: Card
//   turn: string
//   whotPending?: {
//     userId: string
//     shape: string | null
//   }
// }
