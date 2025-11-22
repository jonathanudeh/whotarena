import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrEditWalletAccount } from '../../../services/apiWallet'
import toast from 'react-hot-toast'
import type { WalletAccount } from '../../../types/wallet'

export function useEditWalletAccount() {
  const queryCLient = useQueryClient()

  const { mutate: editWallet, isPending: isEditingWallet } = useMutation({
    mutationFn: ({ id, newWallet }: { id: number; newWallet: Partial<WalletAccount> }) =>
      createOrEditWalletAccount({ id, newWallet }),
    onSuccess: (data) => {
      queryCLient.invalidateQueries({ queryKey: ['WalletAccount'] })
      console.log(data)
      toast.success('Account info edited successfully')
    },
    onError: (err) => {
      console.log(err)

      toast.error(err.message)
    }
  })

  return { editWallet, isEditingWallet }
}
