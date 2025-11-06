import { LuTrash2 } from 'react-icons/lu'
import type { Room } from '../../types/room'
import { useDeleteRoom } from '../../hooks/useDeleteRoom'

interface Props {
  room: Room
  //   onDelete: (id: number) => void
}

export default function RoomRowMobile({ room }: Props) {
  const { mutate, isPending, error } = useDeleteRoom()

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-slate-800 bg-slate-900 p-4 md:hidden">
      <p className="text-lg font-semibold">{room.name}</p>

      <p className="text-slate-300">
        Entry Fee: <span className="text-white">₦{room.entryFee}</span>
      </p>

      <p className="text-slate-300">
        Prize: <span className="text-white">₦{room.prize}</span>
      </p>

      <p className="text-slate-300">
        Max Players: <span className="text-white">{room.maxPlayers}</span>
      </p>

      <button
        onClick={() => mutate(room.id)}
        className="flex w-full items-center justify-center gap-2 rounded bg-red-600 px-3 py-2 font-semibold hover:bg-red-700"
      >
        <LuTrash2 size={18} />
        Delete
      </button>
    </div>
  )
}
