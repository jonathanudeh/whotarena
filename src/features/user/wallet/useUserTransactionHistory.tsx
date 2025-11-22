import { useQuery } from '@tanstack/react-query'
import { transactionsByUser } from '../../../services/apiWalletTransaction'
import { useUser } from '../../auth/useUser'

export function useUserTransactionHistory() {
  const { user } = useUser()

  const { data: transactions, isLoading: isGettingTransactions } = useQuery({
    queryKey: ['transactionHistory', user?.id], // important
    queryFn: () => transactionsByUser(user!.id), // pass the ID
    enabled: !!user?.id // wait for user
  })

  return { transactions, isGettingTransactions }
}
