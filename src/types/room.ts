export interface Room {
  id: number
  created_at?: string
  name: string
  entryFee: number
  prize: number
  maxPlayers: number
}

export interface Tournament {
  id: number
  created_at?: string
  startAt?: string
  endAt?: string
  name: string
  image: string
  entryFee: number
  prize: number
  maxPlayers: number
}
