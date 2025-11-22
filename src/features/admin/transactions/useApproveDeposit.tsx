import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveDeposit as approveDepositApi } from '../../../services/apiWalletTransaction'
import toast from 'react-hot-toast'

export function useApproveDeposit() {
  const queryClient = useQueryClient()

  const { mutate: approveDeposit, isPending: isAccepting } = useMutation({
    mutationFn: approveDepositApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits', 'userBalance'] })
      toast.success('Deposit approved successfully')
    },
    onError: () => {
      toast.error('Error with approval')
    }
  })

  return { approveDeposit, isAccepting }
}
