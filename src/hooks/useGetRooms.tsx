import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../services/apiRooms'

function useGetRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms
  })
}

export default useGetRooms
