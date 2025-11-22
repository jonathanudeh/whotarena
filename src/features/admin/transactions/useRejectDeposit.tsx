import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectDeposit as rejectDepositApi } from '../../../services/apiWalletTransaction'
import toast from 'react-hot-toast'

export function useRejectDeposit() {
  const queryClient = useQueryClient()

  const { mutate: rejectDeposit, isPending: isRejecting } = useMutation({
    mutationFn: rejectDepositApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] })
      toast.success('Deposit rejected')
    },
    onError: () => {
      toast.error('Error with rejection')
    }
  })

  return { rejectDeposit, isRejecting }
}
