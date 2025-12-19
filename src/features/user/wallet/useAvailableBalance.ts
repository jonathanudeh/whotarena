import { useQuery } from '@tanstack/react-query'
import { userAvailableBalance } from '../../../services/apiWalletTransaction'
import { useUser } from '../../auth/useUser'

export function useAvailableBalance() {
  const { user } = useUser()

  const { data: availableBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['userBalance', user?.id],
    queryFn: () => userAvailableBalance(user!.id),
    enabled: !!user?.id
  })

  return { availableBalance, isLoadingBalance }
}
