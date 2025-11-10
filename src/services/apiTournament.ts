import type { Tournament } from '../types/room'
import { supabase, supabaseUrl } from './supabase'

export async function getTournaments() {
  const { data: tournaments, error } = await supabase.from('tournaments').select('*')

  if (error) {
    throw new Error("Couldn't load tournament")
  }

  return tournaments
}

export async function createTournament(newTournament: Tournament) {
  // https://diockcujbtzojmbvoipz.supabase.co/storage/v1/object/public/tournament-images/tournament-bg.png

  const imageName = `${Date.now()}-${newTournament.image.name}`.replace('/', '')

  const imagePath = `${supabaseUrl}/storage/v1/object/public/tournament-images/${imageName}`

  //  creating tournament
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .insert([{ ...newTournament, image: imagePath }])
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('Could not create tournament')
  }

  // if no error creating tournament then i want to upload image
  const { data, error: storageError } = await supabase.storage
    .from('tournament-images')
    .upload(imageName, newTournament.image)

  // if error uploading image just delete the tournament
  if (storageError) {
    await supabase.from('tournaments').delete().eq('id', newTournament.id)
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
