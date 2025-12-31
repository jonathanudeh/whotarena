// import TournamentList from '../features/Tournament/TournamentList'
import RoomList from '../features/rooms/RoomList'
import useGetTournaments from '../hooks/useGetTournament'
import Spinner from '../components/Spinner'
import useGetRooms from '../hooks/useGetRooms'

export default function Lobby() {
  const { IsLoadingTournaments } = useGetTournaments()
  const { isLoadingRooms } = useGetRooms()

  if (IsLoadingTournaments || isLoadingRooms) return <Spinner />

  return (
    <>
      {/* <TournamentList /> */}
      <RoomList />
    </>
  )
}
