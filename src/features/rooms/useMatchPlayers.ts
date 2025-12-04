import { useQuery } from '@tanstack/react-query'
import { getMatchPlayers } from '../../services/apiJoinOrCreateMatch'

export function useMatchPlayers(matchId: number) {
  const { data: players = [], isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['matchPlayers', matchId],
    queryFn: () => getMatchPlayers(matchId),
    enabled: !!matchId,
    refetchInterval: 2000 // TEMP: poll every 2s until realtime setup. we'll remove this when realtime is active
  })

  return { players, isLoadingPlayers }
}
