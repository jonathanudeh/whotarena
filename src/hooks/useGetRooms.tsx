import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../services/apiRooms'

function useGetRooms() {
  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms
  })

  return { rooms, isLoadingRooms }
}

export default useGetRooms
