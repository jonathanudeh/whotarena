import TournamentCard from './TournamentCard'
import useGetTournaments from '../../hooks/useGetTournament'
import { IoFlash } from 'react-icons/io5'

export default function TournamentList() {
  const { getTournaments = [] } = useGetTournaments()

  return (
    <ul className="relative flex flex-col items-center justify-center gap-4 px-4 pb-4">
      <div className="inline-flex items-center gap-2 text-xl font-bold text-yellow-400">
        <IoFlash className="h-6 w-6" />
        <span>Wild Weekend</span>
        <IoFlash className="h-6 w-6" />
      </div>

      {getTournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </ul>
  )
}
