import { useQuery } from '@tanstack/react-query'
import { getTournaments as getTournamentsApi } from '../services/apiTournament'

function useGetTournaments() {
  const { data: getTournaments, isLoading: IsLoadingTournaments } = useQuery({
    queryKey: ['tournaments'],
    queryFn: getTournamentsApi
  })

  return { getTournaments, IsLoadingTournaments }
}

export default useGetTournaments
