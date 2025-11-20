import Spinner from '../../components/Spinner'
import TournamentCard from './TournamentCard'
import useGetTournaments from '../../hooks/useGetTournament'

export default function TournamentList() {
  const { getTournaments = [], IsLoadingTournaments } = useGetTournaments()

  if (IsLoadingTournaments) return <Spinner />

  return (
    <ul className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
      {getTournaments.map((tournament, index) => (
        <TournamentCard key={tournament.id} tournament={tournament} delay={index * 0.1} />
      ))}

      {/* Scroll Indicator */}
      <div className="pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1 md:hidden">
        <div className="h-1 w-2 rounded-full bg-white/40" />
        <div className="h-1 w-4 animate-pulse rounded-full bg-white/80" />
        <div className="h-1 w-2 rounded-full bg-white/40" />
      </div>
    </ul>
  )
}
