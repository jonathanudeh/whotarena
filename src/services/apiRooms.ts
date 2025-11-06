import { supabase } from './supabase'

//
export async function getRooms() {
  const { data, error } = await supabase.from('rooms').select('*')

  if (error) {
    console.error(error)
    throw new Error('Could not get rooms')
  }

  return data ?? []
}

//
export async function createRoom(newRoom) {
  const { data, error } = await supabase.from('rooms').insert([newRoom]).select()

  if (error) {
    console.error(error)
    throw new Error('Could not create room')
  }

  return data
}

//
export async function deleteRoom(id) {
  const { data: rooms, error } = await supabase.from('rooms').delete().eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Could not delete room')
  }

  return rooms
}

export async function updateRoom() {}
