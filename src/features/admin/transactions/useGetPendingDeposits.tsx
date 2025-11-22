import { useQuery } from '@tanstack/react-query'
import { getAllPendingDeposit } from '../../../services/apiWalletTransaction'

export function useGetPendingDeposits() {
  const { data: getPendingDeposits, isLoading: isGettingDeposits } = useQuery({
    queryKey: ['pendingDeposits'],
    queryFn: getAllPendingDeposit
    // refetchInterval: 5000, // every 5 seconds
    // refetchIntervalInBackground: true // keeps polling even if tab is in background
  })

  return { getPendingDeposits, isGettingDeposits }
}
