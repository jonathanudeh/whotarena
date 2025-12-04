import { supabase } from './supabase'

// get all user profile for the admin
export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*')

  if (error) throw new Error(error.message)
  return data
}

// get balance
export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('walletTransactions')
    .select('type, amount, status')
    .eq('userId', userId)
    .eq('isRealMoney', true)
    .in('status', ['approved', 'completed'])

  if (error) throw new Error(error.message)

  const balance = data.reduce((sum, row) => sum + Number(row.amount), 0)

  return balance
}

// ban user
export async function banUser(userId: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: '7d'
  })

  if (error) throw new Error(error.message)
  return true
}

// unban user
export async function unbanUser(userId: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: 'none'
  })

  if (error) throw new Error(error.message)
  return true
}
