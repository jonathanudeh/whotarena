import RoomRowDesktop from './RoomRowDesktop'
import RoomRowMobile from './RoomRowMobile'
import Spinner from '../../components/Spinner'
import useGetRooms from '../../hooks/useGetRooms'

function RoomTable() {
  const { data: rooms, isPending: isGettingRooms } = useGetRooms()

  if (isGettingRooms) return <Spinner />

  if (rooms?.length === 0)
    return (
      <div className="flex h-45 items-center justify-center">
        <div className="text-center">No Rooms, Create new room</div>
      </div>
    )

  return (
    <div role="table" className="font-xl md:bg-slate-800">
      <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] border-b border-slate-700 px-4 py-2 text-slate-400 md:grid">
        <div>Name</div>
        <div>Entry Fee</div>
        <div>Prize</div>
        <div>Max Players</div>
        <div>Actions</div>
      </div>

      {rooms?.map((room) => (
        <div key={room.id}>
          <RoomRowDesktop room={room} />
          <RoomRowMobile room={room} />
        </div>
      ))}
    </div>
  )
}

export default RoomTable
