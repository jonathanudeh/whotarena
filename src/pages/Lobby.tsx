// import TournamentList from '../features/Tournament/TournamentList'
import RoomList from '../features/rooms/RoomList'
import useGetTournaments from '../hooks/useGetTournament'
import Spinner from '../components/Spinner'
import useGetRooms from '../hooks/useGetRooms'
import { useEffect } from 'react'

export default function Lobby() {
  const { IsLoadingTournaments } = useGetTournaments()
  const { isLoadingRooms } = useGetRooms()

  // ensures lobby is always a clean anchor.
  useEffect(() => {
    window.history.replaceState(null, '', '/lobby')
  }, [])

  if (IsLoadingTournaments || isLoadingRooms) return <Spinner />

  return (
    <>
      {/* <TournamentList /> */}
      <RoomList />
    </>
  )
}
