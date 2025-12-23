// features/rooms/hooks/useGameRealtime.ts
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../../../services/supabase'
import { getMatchPlayers } from '../../../services/apiJoinOrCreateMatch'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Match, Player, Profile, Card, GameState, LastAction } from '../types'

interface UseGameRealtimeProps {
  matchId: string | undefined
  userId: string
  profiles: Record<string, Profile>
  setMatch: React.Dispatch<React.SetStateAction<Match | null>>
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, Profile>>>
  setHand: React.Dispatch<React.SetStateAction<Card[]>>
  setTopCard: React.Dispatch<React.SetStateAction<Card | null>>
}

export function useGameRealtime({
  matchId,
  userId,
  profiles,
  setMatch,
  setPlayers,
  setProfiles,
  setHand,
  setTopCard
}: UseGameRealtimeProps): void {
  // Match state updates subscription
  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`public:matches:id=eq.${matchId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
        (payload: RealtimePostgresChangesPayload<Match>) => {
          const newRow = payload.new as Match
          const oldRow = payload.old as Match | undefined

          if (!newRow) return

          // Update match - proper type handling
          setMatch((prev) => {
            if (!prev) return newRow
            return { ...prev, ...newRow }
          })

          const newGS = newRow.gameState
          const oldGS = oldRow?.gameState

          // Update UI state
          if (newGS) {
            if (newGS.discardTop) setTopCard(newGS.discardTop)
            if (userId) setHand(newGS.hands?.[userId] ?? [])
          }

          // Handle game action notifications
          handleGameActionNotifications(newGS, oldGS, userId, profiles)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, userId, profiles, setMatch, setHand, setTopCard])

  // Players subscription
  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`matchPlayers:matchId=${matchId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matchPlayers', filter: `matchId=eq.${matchId}` },
        async () => {
          try {
            const updated = await getMatchPlayers(Number(matchId))
            setPlayers(updated)

            // Refresh profiles
            const humanPlayerIds = updated.map((p) => p.userId).filter((id): id is string => !!id)

            if (humanPlayerIds.length > 0) {
              const { data: profs, error } = await supabase
                .from('profiles')
                .select('*')
                .in('userId', humanPlayerIds)

              if (error) throw error

              const profileMap: Record<string, Profile> = {}
              profs?.forEach((p) => (profileMap[p.userId] = p))
              setProfiles(profileMap)
            }
          } catch (error) {
            console.error('Error updating players:', error)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, setPlayers, setProfiles])
}

function handleGameActionNotifications(
  newGS: GameState | null | undefined,
  oldGS: GameState | null | undefined,
  userId: string,
  profiles: Record<string, Profile>
): void {
  if (!newGS) return

  const oldActionId = oldGS?.lastAction?.id
  const newAction = newGS.lastAction

  if (!newAction || newAction.id === oldActionId) return

  const actorName = profiles[newAction.actor]?.username ?? 'Player'

  if (newAction.type === 'play') {
    handlePlayNotification(newAction, actorName, userId, profiles)
  } else if (newAction.type === 'chooseShape') {
    toast(`${actorName} chose ${newAction.shape?.toUpperCase()}`)
  }
}

function handlePlayNotification(
  action: LastAction,
  actorName: string,
  userId: string,
  profiles: Record<string, Profile>
): void {
  const { cardNum: num, target, stackedTwo } = action

  toast.dismiss()

  switch (num) {
    case 1: {
      toast(`${actorName} played HOLD ON, they keep the turn.`)
      break
    }

    case 2: {
      const targetName = profiles[target!]?.username ?? target
      toast(`${actorName} played PICK TWO — ${targetName} must pick ${stackedTwo}`)
      if (userId === target) {
        toast.error(`You must pick ${stackedTwo} cards`)
      }
      break
    }

    case 8: {
      const skippedName = profiles[target!]?.username ?? target
      toast(`${actorName} played SUSPENSION, ${skippedName?.toUpperCase()} was skipped`)
      if (userId === target) {
        toast.error('You were suspended (skipped)')
      }
      break
    }

    case 14: {
      toast(`${actorName} played GENERAL MARKET. 1 card for everyone!`)
      break
    }

    case 20: {
      toast(`${actorName} played WHOT — waiting for shape choice`)
      break
    }

    default:
      break
  }
}
