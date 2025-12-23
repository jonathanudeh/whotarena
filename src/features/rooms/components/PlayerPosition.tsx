import { useMemo } from 'react'
import PlayerBubble from '../PlayerBubble'
import type { Player, Profile, GameState } from '../types'
import { getPlayerIdentity, getPlayerKey, getPositionStyle } from './playerHelpers'

interface PlayerPositionsProps {
  players: Player[]
  profiles: Record<string, Profile>
  gameState: GameState
  currentUserId: string
}

export default function PlayerPositions({
  players,
  profiles,
  gameState,
  currentUserId
}: PlayerPositionsProps) {
  // Memoize ordered players with their display data
  const orderedPlayersWithData = useMemo(() => {
    const ordered = [...players]
    ordered.sort((a, b) => {
      if (a.userId === currentUserId) return -1
      if (b.userId === currentUserId) return 1
      return 0
    })

    return ordered.map((p) => ({
      player: p,
      key: getPlayerKey(p),
      identity: getPlayerIdentity(p, profiles)
    }))
  }, [players, currentUserId, profiles])

  return (
    <div className="pointer-events-none absolute inset-0">
      {orderedPlayersWithData.map((playerData, i) => {
        const { key: playerKey, identity } = playerData

        return (
          <PlayerBubble
            key={playerKey}
            username={identity.name}
            avatar={identity.avatar}
            className={`absolute ${getPositionStyle(i, orderedPlayersWithData.length)}`}
            isTurn={gameState.turn === playerKey}
            cardCount={gameState.hands?.[playerKey]?.length ?? 0}
            isMe={playerKey === currentUserId}
          />
        )
      })}
    </div>
  )
}
