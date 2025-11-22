import { useQuery } from '@tanstack/react-query'
import { getUserStats as getUserStatsApi } from '../../../services/apiAdminUsers'

export function useGetUserStats(userId: string | null) {
  const { data: getUserStats, isLoading: isGettingUsersStat } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => getUserStatsApi(userId!),
    enabled: !!userId
  })

  return { getUserStats, isGettingUsersStat }
}
