import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../services/apiTournament'

function useGetTournaments() {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: getTournaments
  })
}

export default useGetTournaments
