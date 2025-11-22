import type { WalletAccount } from '../types/wallet'
import { supabase } from './supabase'

export async function getWalletAccount() {
  const { data: walletAccount, error } = await supabase.from('walletAccount').select('*')

  if (error) {
    console.log(error)

    throw new Error(error.message)
  }

  return walletAccount
}

export async function createOrEditWalletAccount({
  id,
  newWallet
}: {
  id: number | null
  newWallet: Partial<WalletAccount>
}) {
  if (!id) {
    const { data, error } = await supabase.from('walletAccount').insert([newWallet]).select()

    if (error) {
      console.log(error)
      throw new Error(error.message)
    }

    return data
  } else {
    const { data, error } = await supabase
      .from('walletAccount')
      .update(newWallet)
      .eq('id', id)
      .select()

    if (error) {
      console.log(error)

      throw new Error(error.message)
    }

    return data
  }
}
