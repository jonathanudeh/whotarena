import RoomCard from './RoomCard'
import useGetRooms from '../../hooks/useGetRooms'
import { IoFlash } from 'react-icons/io5'

export default function RoomList() {
  const { rooms = [] } = useGetRooms()

  return (
    <ul className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
      <li className="col-span-full mb-2 flex justify-center">
        <div className="inline-flex items-center gap-2 text-xl font-bold text-yellow-400">
          <IoFlash className="h-6 w-6" />
          <span>Wild Week</span>
          <IoFlash className="h-6 w-6" />
        </div>
      </li>
      {rooms.map((room, index) => (
        <RoomCard key={room.id} room={room} delay={index * 0.1} />
      ))}
    </ul>
  )
}
