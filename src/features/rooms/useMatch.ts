import { useQuery } from '@tanstack/react-query'
import { getMatch } from '../../services/apiJoinOrCreateMatch'

export function useMatch(matchId: number) {
  const { data: match, isLoading: isLoadingMatch } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatch(matchId),
    enabled: !!matchId // only run if matchId exists
  })

  return { match, isLoadingMatch }
}
