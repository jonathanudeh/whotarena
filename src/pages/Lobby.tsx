import { motion } from 'framer-motion'

import { IoFlash } from 'react-icons/io5'
import useGetRooms from '../hooks/useGetRooms'
import RoomCard from '../features/rooms/RoomCard'
import Spinner from '../components/Spinner'
import useGetTournaments from '../hooks/useGetTournament'
import TournamentCard from '../features/Tournament/TournamentCard'

export default function Lobby() {
  const { data: rooms = [], isPending: isLoadingRooms } = useGetRooms()
  const { data: tournments = [], isPending: isLoadingTournament } = useGetTournaments()

  if (isLoadingRooms || isLoadingTournament) return <Spinner />

  return (
    <>
      <motion.div
        className="px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 text-xl font-bold text-yellow-400">
          <IoFlash className="h-6 w-6" />
          <span>Wild Weekend</span>
          <IoFlash className="h-6 w-6" />
        </div>
      </motion.div>
      {
        <ul className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
          {tournments.map((tournament, index) => (
            <TournamentCard key={tournament.id} tournament={tournament} delay={index * 0.1} />
          ))}

          {/* Scroll Indicator */}
          <div className="pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1 md:hidden">
            <div className="h-1 w-2 rounded-full bg-white/40" />
            <div className="h-1 w-4 animate-pulse rounded-full bg-white/80" />
            <div className="h-1 w-2 rounded-full bg-white/40" />
          </div>
        </ul>
      }
      {
        <ul className="flex flex-col justify-around gap-4 px-4 pt-6 md:flex-row md:flex-wrap md:items-start md:gap-3">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} delay={index * 0.1} />
          ))}
        </ul>
      }
    </>
  )
}
