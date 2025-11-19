import Spinner from '../../components/Spinner'
import RoomCard from './RoomCard'
import useGetRooms from '../../hooks/useGetRooms'

export default function RoomList() {
  const { rooms = [], isLoadingRooms } = useGetRooms()

  if (isLoadingRooms) return <Spinner />

  return (
    <ul className="flex flex-col justify-around gap-4 px-4 pt-6 md:flex-row md:flex-wrap md:items-start md:gap-3">
      {rooms.map((room, index) => (
        <RoomCard key={room.id} room={room} delay={index * 0.1} />
      ))}
    </ul>
  )
}
