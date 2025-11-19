import { LuTrash2 } from 'react-icons/lu'
import { useDeleteTournament } from '../../../hooks/useDeleteTournament'
import type { FetchedTournament } from '../../../types/tournament'

interface Props {
  tournament: FetchedTournament
}

export default function TournamentRowDesktop({ tournament }: Props) {
  const { deleteTournament, isDeleting } = useDeleteTournament()

  return (
    <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 rounded border-b border-slate-800 bg-slate-900 px-4 py-3 md:grid">
      <div className="flex h-15 w-15 items-center justify-center">
        <img src={tournament.image} alt="Tournament image" className="aspect-video" />
      </div>
      <div>{tournament.name}</div>
      <div>₦{tournament.entryFee}</div>
      <div>₦{tournament.prize}</div>
      <div>{tournament.maxPlayers}</div>
      <div>{tournament.startAt}</div>
      <div>{tournament.endAt}</div>

      <button
        onClick={() => {
          if (tournament.id) deleteTournament(tournament.id)
        }}
        className={`flex cursor-pointer items-center gap-1 rounded bg-red-600 px-2 py-2 text-white ${isDeleting ? 'bg-slate-950' : 'hover:bg-red-700'}`}
        disabled={isDeleting}
      >
        <LuTrash2 size={18} />
      </button>
    </div>
  )
}
