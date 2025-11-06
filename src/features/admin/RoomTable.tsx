import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../../services/apiRooms'
import RoomRowDesktop from './RoomRowDesktop'
import RoomRowMobile from './RoomRowMobile'
import Spinner from '../../components/Spinner'

function RoomTable() {
  const {
    data: rooms,
    isLoading,
    error
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms
  })

  if (isLoading) return <Spinner />

  return (
    <div role="table" className="font-xl md:bg-slate-800">
      <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] border-b border-slate-700 px-4 py-2 text-slate-400 md:grid">
        <div>Name</div>
        <div>Entry Fee</div>
        <div>Prize</div>
        <div>Max Players</div>
        <div></div>
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
