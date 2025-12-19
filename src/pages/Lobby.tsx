import { IoFlash } from 'react-icons/io5'
import TournamentList from '../features/Tournament/TournamentList'
import RoomList from '../features/rooms/RoomList'

export default function Lobby() {
  return (
    <>
      <div>
        <div className="inline-flex items-center gap-2 text-xl font-bold text-yellow-400">
          <IoFlash className="h-6 w-6" />
          <span>Wild Weekend</span>
          <IoFlash className="h-6 w-6" />
        </div>
      </div>

      <TournamentList />
      <RoomList />
    </>
  )
}
