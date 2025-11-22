import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrEditWalletAccount } from '../../../services/apiWallet'
import toast from 'react-hot-toast'
import type { WalletAccount } from '../../../types/wallet'

export function useCreatWalletAccount() {
  const queryCLient = useQueryClient()

  const { mutate: createWallet, isPending: iscreatingWallet } = useMutation({
    mutationFn: ({ newWallet }: { newWallet: Partial<WalletAccount> }) =>
      createOrEditWalletAccount({ id: null, newWallet }),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ['WalletAccount'] })
      toast.success('Account info created successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error(err.message)
    }
  })

  return { createWallet, iscreatingWallet }
}
