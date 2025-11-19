export interface AddTournamentModalProps {
  onClose: () => void
}

export interface FormTournament {
  name: string
  entryFee: number
  prize: number
  maxPlayers: number
  startAt: string
  endAt: string
  image: FileList
}

export interface FetchedTournament {
  id?: number
  created_at?: string
  startAt?: string
  endAt?: string
  name: string
  image: string
  entryFee: number
  prize: number
  maxPlayers: number
}

export interface CreateTournamentPayload
  extends Omit<FetchedTournament, 'id' | 'created_at' | 'image'> {
  image: File // <-- Must be a File object for the upload
}
