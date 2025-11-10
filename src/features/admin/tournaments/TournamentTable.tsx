import Spinner from '../../../components/Spinner'
import useGetTournaments from '../../../hooks/useGetTournament'
import TournamentRowDesktop from './TournamentRowDesktop'
import TournamentRowMobile from './TournamentRowMobile'

function TournamentTable() {
  const { data: tournaments, isPending: isGettingRooms } = useGetTournaments()

  if (isGettingRooms) return <Spinner />

  if (tournaments?.length === 0)
    return (
      <div className="flex h-45 items-center justify-center">
        <div className="text-center">No tournaments, Create new tournament</div>
      </div>
    )

  return (
    <div role="table" className="font-xl md:bg-slate-800">
      <div
        role="row"
        className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] border-b border-slate-700 px-4 py-2 text-slate-400 md:grid"
      >
        <div>Image</div>
        <div>Name</div>
        <div>Entry Fee</div>
        <div>Prize</div>
        <div>Max Players</div>
        <div>Start</div>
        <div>End</div>
        <div>Action</div>
      </div>

      {tournaments?.map((tournament) => (
        <div key={tournament.id} role="row">
          <TournamentRowDesktop tournament={tournament} />
          <TournamentRowMobile tournament={tournament} />
        </div>
      ))}
    </div>
  )
}

export default TournamentTable
