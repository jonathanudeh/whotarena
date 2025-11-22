import { useQuery } from '@tanstack/react-query'
import { getWalletAccount as getWalletAccountApi } from '../services/apiWallet'
import type { WalletAccount } from '../types/wallet'

export function useGetWalletAccount() {
  const { data: getWalletAccount, isLoading: isGettingAccount } = useQuery<WalletAccount[]>({
    queryKey: ['WalletAccount'],
    queryFn: getWalletAccountApi
  })

  return { getWalletAccount, isGettingAccount }
}
