import type { UploadDepositParams } from '../types/wallet'
import { supabase } from './supabase'

export async function userAvailableBalance(userId: string) {
  const { data, error } = await supabase
    .from('walletTransactions')
    .select('amount')
    .eq('userId', userId)
    .eq('isRealMoney', true)
    .in('status', ['approved', 'completed'])

  if (error) throw new Error(error.message)

  return data.reduce((sum, row) => sum + Number(row.amount), 0)
}

export async function getAllPendingDeposit() {
  const { data: pendingDeposits, error } = await supabase
    .from('walletTransactions')
    .select('*')
    .eq('type', 'depositRequest')
    .eq('status', 'pending')
    .eq('isRealMoney', false)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  // 2️⃣ Get all profiles for these users
  const userIds = [...new Set(pendingDeposits.map((d) => d.userId))]

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('userId, username, email')
    .in('userId', userIds)

  if (profilesError) throw new Error(profilesError.message)

  // 3️⃣ Merge deposits with username
  const result = pendingDeposits.map((d) => ({
    ...d,
    username: profiles.find((p) => p.userId === d.userId)?.username ?? null,
    email: profiles.find((p) => p.userId === d.userId)?.email ?? null
  }))

  console.log(result)

  return result
}

export async function uploadDeposit({ amount, imgFileProof, info }: UploadDepositParams) {
  const filePath =
    `deposit-${imgFileProof.name}-${Math.random().toString(36).substring(7)}`.replaceAll('/', '')

  const { error: storageError } = await supabase.storage
    .from('depositProofs')
    .upload(filePath, imgFileProof)

  if (storageError) throw new Error(storageError.message)

  const { data: imageProofUrl } = supabase.storage.from('depositProofs').getPublicUrl(filePath)

  const imageProof = imageProofUrl.publicUrl

  const obj = { amount, imageProof, ...info }

  const { data, error } = await supabase.from('walletTransactions').insert([obj]).select()

  if (error) throw new Error(error.message)

  return data
}

export async function approveDeposit(depositId: number) {
  // updating the deposit row to approved
  await supabase.from('walletTransactions').update({ status: 'approved' }).eq('id', depositId)

  //
  const { data: depositRequest } = await supabase
    .from('walletTransactions')
    .select('*')
    .eq('id', depositId)
    .single()

  await supabase.from('walletTransactions').insert({
    userId: depositRequest.userId,
    type: 'deposit',
    amount: +Math.abs(depositRequest.amount),
    status: 'approved',
    isRealMoney: true
  })
}

export async function rejectDeposit(depositId: number) {
  await supabase.from('walletTransactions').update({ status: 'rejected' }).eq('id', depositId)
}

// export async function showUsersOnlyTransactionHistory(userId: string) {
//   const { data, error } = await supabase
//     .from('walletTransactions')
//     .select('*')
//     .eq('userId', userId)
//     .neq('type', 'deposit') // exclude requests
//     .order('created_at', { ascending: false })

//   if (error) throw new Error(error.message)

//   return data
// }

export async function transactionsByUser(userId: string) {
  const { data, error } = await supabase
    .from('walletTransactions')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
