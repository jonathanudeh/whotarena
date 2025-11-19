import { useQuery } from '@tanstack/react-query'
import { getCurrentuser } from '../../services/apiAuth'

export function useUser() {
  const { data: user, isLoading: isFetchingUser } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentuser
  })

  return { isFetchingUser, user, isAuthenticated: user?.role === 'authenticated' }
}
