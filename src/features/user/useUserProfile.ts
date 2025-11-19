import { useQuery } from '@tanstack/react-query'
import { getCurrentUserProfile } from '../../services/apiUserProfile'

export function useUserProfile() {
  const { data: userProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getCurrentUserProfile
  })

  return { userProfile, isLoadingUserProfile }
}
