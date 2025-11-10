import type { Room } from '../types/room'
import { supabase } from './supabase'

//
export async function getRooms() {
  const { data, error } = await supabase.from('rooms').select('*')

  if (error) {
    console.error(error)
    throw new Error('Could not load rooms')
  }

  return data ?? []
}

//
export async function createRoom(newRoom: Room) {
  const { data, error } = await supabase.from('rooms').insert([newRoom]).select().single()

  if (error) {
    console.error(error)
    throw new Error('Could not create room')
  }

  return data
}

//
export async function deleteRoom(id: number) {
  const { data: room, error } = await supabase.from('rooms').delete().eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Could not delete room')
  }

  return room
}

export async function updateRoom() {}
