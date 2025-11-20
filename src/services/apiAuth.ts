import type { LogInCredentials, SignUpCredentials } from '../types/services'
import { createUserProfile } from './apiUserProfile'
import { supabase } from './supabase'

export async function signUp({ email, password, username }: SignUpCredentials) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) throw new Error(error.message)

  const userId = data?.user?.id
  const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`

  // creating user profile if auth was successful
  if (userId) await createUserProfile(userId, username, avatar)

  return data
}

export async function logIn({ email, password }: LogInCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw new Error(error.message)

  return data
}

export async function getCurrentuser() {
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return null

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error) throw new Error(error.message)

  return user
}

export async function logOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}
