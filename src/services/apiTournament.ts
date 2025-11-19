import type { CreateTournamentPayload } from '../types/tournament'
import { supabase, supabaseUrl } from './supabase'

export async function getTournaments() {
  const { data: tournaments, error } = await supabase.from('tournaments').select('*')

  if (error) {
    throw new Error("Couldn't load tournament")
  }

  return tournaments
}

export async function createTournament(newTournament: CreateTournamentPayload) {
  // 1. Prepare image details
  const imageName = `${Date.now()}-${newTournament.image.name}`.replace('/', '')
  let imagePath = ''

  const { error: storageError } = await supabase.storage
    .from('tournament-images')
    .upload(imageName, newTournament.image)

  if (storageError) {
    throw new Error(storageError.message)
  }

  // After a successful upload to the public bucket i now make the path
  imagePath = `${supabaseUrl}/storage/v1/object/public/tournament-images/${imageName}`

  // and the create tournament
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .insert([{ ...newTournament, image: imagePath }])
    .select()
    .single()

  if (error) {
    await supabase.storage.from('tournament-images').remove([imageName])
    throw new Error('Could not create tournament and associated image file was deleted.')
  }

  return tournament
}

export async function updateTournament() {}

export async function deleteTournament(id: number) {
  const { data: tournament, error } = await supabase.from('tournaments').delete().eq('id', id)

  if (error) {
    throw new Error('Could not delete tournament')
  }

  return tournament
}
