import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadDeposit as uploadDepositApi } from '../../../services/apiWalletTransaction'
import toast from 'react-hot-toast'

export function useUploadDeposit() {
  const queryClient = useQueryClient()

  const { mutate: uploadDeposit, isPending: isUploadingDeposit } = useMutation({
    mutationFn: uploadDepositApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] })
      toast.success('Deposit submission successful. \n Please wait while we confirm')
    },
    onError: () => {
      toast.error('Submission failed, please try again!')
    }
  })

  return { uploadDeposit, isUploadingDeposit }
}
