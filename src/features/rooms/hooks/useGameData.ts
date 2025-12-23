import { useEffect, useState } from 'react'
import { getMatch, getMatchPlayers } from '../../../services/apiJoinOrCreateMatch'
import { supabase } from '../../../services/supabase'
import type { Match, Player, Profile, Card } from '../types'

interface UseGameDataReturn {
  match: Match | null
  players: Player[]
  profiles: Record<string, Profile>
  hand: Card[]
  topCard: Card | null
  setMatch: React.Dispatch<React.SetStateAction<Match | null>>
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, Profile>>>
  setHand: React.Dispatch<React.SetStateAction<Card[]>>
  setTopCard: React.Dispatch<React.SetStateAction<Card | null>>
}

export function useGameData(
  matchId: string | undefined,
  userId: string | undefined
): UseGameDataReturn {
  const [match, setMatch] = useState<Match | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [hand, setHand] = useState<Card[]>([])
  const [topCard, setTopCard] = useState<Card | null>(null)

  useEffect(() => {
    if (!matchId || !userId) return

    async function loadGameData() {
      try {
        // Fetch match
        const matchData = await getMatch(Number(matchId))
        setMatch(matchData)

        // Fetch players
        const matchPlayers = await getMatchPlayers(Number(matchId))
        setPlayers(matchPlayers)

        // Restore game state if exists
        if (matchData.gameState) {
          const gs = matchData.gameState
          if (gs.discardTop) setTopCard(gs.discardTop)
          if (userId) setHand(gs.hands?.[userId] ?? [])
        }

        // Fetch profiles for human players
        const humanPlayerIds = matchPlayers.map((p) => p.userId).filter((id): id is string => !!id)

        if (humanPlayerIds.length > 0) {
          const { data: profs, error } = await supabase
            .from('profiles')
            .select('*')
            .in('userId', humanPlayerIds)

          if (error) {
            console.error('Error fetching profiles:', error)
            return
          }

          const profileMap: Record<string, Profile> = {}
          profs?.forEach((p) => {
            profileMap[p.userId] = p
          })
          setProfiles(profileMap)
        }
      } catch (error) {
        console.error('Error loading game data:', error)
      }
    }

    loadGameData()
  }, [matchId, userId])

  return {
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
  }
}
