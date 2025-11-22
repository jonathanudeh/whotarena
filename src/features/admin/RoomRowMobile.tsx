import { LuTrash2 } from 'react-icons/lu'
import type { Room } from '../../types/room'
import { useDeleteRoom } from '../../hooks/useDeleteRoom'
import { useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'

interface Props {
  room: Room
}

export default function RoomRowMobile({ room }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<() => void>(() => {})

  const { mutate, isPending: isDeleting } = useDeleteRoom()

  const { id, name, entryFee, prize, maxPlayers } = room

  return (
    <>
      <div className="mt-3 space-y-2 rounded-lg border border-slate-800 bg-slate-900 p-4 md:hidden">
        <p className="text-lg font-semibold">{name}</p>

        <p className="text-slate-300">
          Entry Fee: <span className="text-white">₦{entryFee}</span>
        </p>

        <p className="text-slate-300">
          Prize: <span className="text-white">₦{prize}</span>
        </p>

        <p className="text-slate-300">
          Max Players: <span className="text-white">{maxPlayers}</span>
        </p>

        <button
          onClick={() => {
            setModalAction(() => () => {
              if (id) mutate(id)
            })
            setIsModalOpen(true)
          }}
          disabled={isDeleting}
          className={`bg-btn-danger flex w-full items-center justify-center gap-2 rounded px-3 py-2 font-semibold hover:bg-red-700 ${isDeleting ? 'bg-slate-950' : ''}`}
        >
          <LuTrash2 size={18} />
        </button>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete this room?"
        message="This action cannot be undone."
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
        disabled={isDeleting}
      />
    </>
  )
}
