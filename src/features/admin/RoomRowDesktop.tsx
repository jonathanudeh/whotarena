import { LuTrash2 } from 'react-icons/lu'
import type { Room } from '../../types/room'
import { useDeleteRoom } from '../../hooks/useDeleteRoom'

interface Props {
  room: Room
  //   onDelete: (id: number) => void
}

export default function RoomRowDesktop({ room }: Props) {
  const { mutate, isPending: isDeleting } = useDeleteRoom()

  return (
    <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] items-center rounded border-b border-slate-800 bg-slate-900 px-4 py-3 md:grid">
      <div>{room.name}</div>
      <div>₦{room.entryFee}</div>
      <div>₦{room.prize}</div>
      <div>{room.maxPlayers}</div>

      <button
        onClick={() => mutate(room.id)}
        className={`flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 ${isDeleting ? 'bg-slate-950' : ''}`}
        disabled={isDeleting}
      >
        <LuTrash2 size={18} />
        Delete
      </button>
    </div>
  )
}
