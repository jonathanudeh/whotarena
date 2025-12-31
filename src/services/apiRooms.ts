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
// export async function deleteRoom(id: number) {
//   const { data: room, error } = await supabase.from('rooms').delete().eq('id', id)

//   if (error) {
//     console.error(error)
//     throw new Error('Could not delete room')
//   }

//   return room
// }

export async function deleteRoom(id: number) {
  // 1 Get matches for this room
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id, status')
    .eq('roomId', id)

  if (matchesError) {
    console.error(matchesError)
    throw new Error('Could not verify room matches')
  }

  // 2 Block deletion if any match is playing
  const hasActiveMatch = matches?.some((match) => match.status === 'playing')

  if (hasActiveMatch) {
    throw new Error('Players are currently playing in this room')
  }

  // 3 Delete matchPlayers, if matches exist
  const matchIds = matches.map((m) => m.id)

  if (matchIds.length > 0) {
    const { error: playersError } = await supabase
      .from('matchPlayers')
      .delete()
      .in('matchId', matchIds)

    if (playersError) {
      console.error(playersError)
      throw new Error('Could not delete match players')
    }

    // 4 Delete matches
    const { error: deleteMatchesError } = await supabase.from('matches').delete().in('id', matchIds)

    if (deleteMatchesError) {
      console.error(deleteMatchesError)
      throw new Error('Could not delete matches')
    }
  }

  // 5 Delete room
  const { data: room, error: roomError } = await supabase.from('rooms').delete().eq('id', id)

  if (roomError) {
    console.error(roomError)
    throw new Error('Could not delete room')
  }

  return room
}

export async function updateRoom() {}
