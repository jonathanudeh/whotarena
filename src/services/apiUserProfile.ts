import type { updateUserAvatarProps, updateUserusernameProps } from '../types/services'
import { supabase } from './supabase'

// used in the apiAuth while signing a user up
export async function createUserProfile(
  userId: string,
  username: string,
  avatar: string,
  email: string
) {
  const obj = { userId, username, avatar, email }

  const { error } = await supabase.from('profiles').insert(obj).select()

  if (error) {
    console.error('Error creating user profile:', error)

    // 1. Attempt to delete phantom user from Supabase Auth i.e user that doesnt have a profile to avoid data inconsistency

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error(
        `Critical Error: Failed to delete user ${userId} after profile creation failed. Manual cleanup required.`,
        deleteError
      )

      // Re-throw the original profile creation error, but acknowledge the cleanup failure.
      throw new Error(
        `Profile creation failed and manual cleanup for user ${userId} may be needed. Original error: ${error.message}`
      )
    }

    // 2. If deletion was successful, throw the original error message to the client.
    throw new Error(`Account setup failed. Please try again. (${error.message})`)
  }
}

export async function getCurrentUserProfile() {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError) throw new Error(authError.message)
  if (!user) throw new Error('No logged in user')

  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', user?.id)
    .single()

  if (profileError) throw new Error(profileError.message)

  return userProfile
}

export async function getProfileByUserId(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('userId', userId).single()

  if (error) throw new Error(error.message)

  return data
}

export async function updateCurrentUserAvatar({ id, avatarFile }: updateUserAvatarProps) {
  let publicUrl = ''

  // Check if it's a Dicebear URL (string)
  const isAvatarDicebear =
    typeof avatarFile === 'string' && avatarFile?.startsWith('https://api.dicebear.com')

  if (isAvatarDicebear) {
    publicUrl = avatarFile as string
  } else if (avatarFile instanceof File) {
    // if user uploaded a file
    const fileName =
      `avatar-${avatarFile.name}.${Math.random().toString(36).substring(7)}`.replaceAll('/', '')

    //  Performing the upload/replace
    const { error: storageError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, {
        upsert: true
      })

    if (storageError) throw new Error(storageError.message)

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)

    publicUrl = publicUrlData.publicUrl
  } else {
    throw new Error('Invalid avatar data provided.')
  }

  // 3. Update the profiles table with the final public URL
  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar: publicUrl })
    .eq('userId', id)
    .select()

  if (error) throw new Error(error.message)
  return data
}

export async function updateCurrentUserUsername({ id, username }: updateUserusernameProps) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('userId', id)
    .select()

  if (error) throw new Error(error.message)
  return data
}
