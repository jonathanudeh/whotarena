import { supabase } from './supabase'

// get all user profile for the admin
export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*')

  if (error) throw new Error(error.message)
  return data
}

// get balance + deposit for one user
export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('walletTransactions')
    .select('type, amount, status')
    .eq('userId', userId)

  if (error) throw new Error(error.message)

  const completed = data.filter((t) => t.status === 'approved')

  const balance = completed.reduce((sum, t) => sum + t.amount, 0)

  const totalDeposits = completed
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  return { balance, totalDeposits }
}

// ban user
export async function banUser(userId: string) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 30)

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: tomorrow.toISOString()
  })

  if (error) throw new Error(error.message)
  return true
}

// unban user
export async function unbanUser(userId: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: null
  })

  if (error) throw new Error(error.message)
  return true
}
