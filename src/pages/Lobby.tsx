// import TournamentList from '../features/Tournament/TournamentList'
import RoomList from '../features/rooms/RoomList'
import useGetTournaments from '../hooks/useGetTournament'
import Spinner from '../components/Spinner'
import useGetRooms from '../hooks/useGetRooms'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Lobby() {
  const { IsLoadingTournaments } = useGetTournaments()
  const { isLoadingRooms } = useGetRooms()
  const location = useLocation()

  // ensures lobby is always a clean anchor.
  useEffect(() => {
    window.history.replaceState(null, '', '/lobby')
  }, [])

  // 3 Lock browser back/forward buttons
  useEffect(() => {
    // Push current location twice to prevent back
    window.history.pushState(null, '', location.pathname)
    window.history.pushState(null, '', location.pathname)

    const handlePopState = () => window.history.pushState(null, '', location.pathname)
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [location.pathname])

  if (IsLoadingTournaments || isLoadingRooms) return <Spinner />

  return (
    <>
      {/* <TournamentList /> */}
      <RoomList />
    </>
  )
}
