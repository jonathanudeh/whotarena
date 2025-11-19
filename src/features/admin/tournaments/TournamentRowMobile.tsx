import { LuTrash2 } from 'react-icons/lu'
import { useDeleteTournament } from '../../../hooks/useDeleteTournament'
import type { FetchedTournament } from '../../../types/tournament'

interface Props {
  tournament: FetchedTournament
}

export default function TournamentRowMobile({ tournament }: Props) {
  const { deleteTournament, isDeleting } = useDeleteTournament()

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-slate-700 bg-slate-900 p-4 md:hidden">
      <p className="text-center text-lg font-bold">{tournament.name}</p>

      <div className="">
        <img
          src={tournament.image}
          alt="Tournament image"
          className="aspect-video w-full object-cover"
        />
      </div>

      <p className="text-slate-300">
        Entry Fee: <span className="text-white">₦{tournament.entryFee}</span>
      </p>

      <p className="text-slate-300">
        Prize: <span className="text-white">₦{tournament.prize}</span>
      </p>

      <p className="text-slate-300">
        Max Players: <span className="text-white">{tournament.maxPlayers}</span>
      </p>
      <p className="text-slate-300">
        Start date: <span className="text-white">{tournament.startAt}</span>
      </p>
      <p className="text-slate-300">
        End date: <span className="text-white">{tournament.endAt}</span>
      </p>

      <button
        onClick={() => {
          if (tournament.id) deleteTournament(tournament.id)
        }}
        disabled={isDeleting}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-red-600 px-3 py-2 font-semibold ${isDeleting ? 'bg-slate-950' : 'hover:bg-red-700'}`}
      >
        <LuTrash2 size={18} />
      </button>
    </div>
  )
}
