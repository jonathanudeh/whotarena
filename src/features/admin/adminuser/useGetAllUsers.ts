import { useQuery } from '@tanstack/react-query'
import { getAllUsers as getAllUsersApi } from '../../../services/apiAdminUsers'

export function useGetUsers() {
  const { data: getAllUsers, isLoading: isGettingAllUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsersApi
  })

  return { getAllUsers, isGettingAllUsers }
}
