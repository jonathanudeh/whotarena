import { LuTrash2 } from 'react-icons/lu'
import type { Room } from '../../types/room'
import { useDeleteRoom } from '../../hooks/useDeleteRoom'
import { useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'

interface Props {
  room: Room
}

export default function RoomRowDesktop({ room }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<() => void>(() => {})
  const { mutate, isPending: isDeleting } = useDeleteRoom()
  const { id, name, entryFee, prize, maxPlayers } = room

  return (
    <>
      <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] items-center rounded border-b border-slate-800 bg-slate-900 px-4 py-3 md:grid">
        <div>{name}</div>
        <div>₦{entryFee}</div>
        <div>₦{prize}</div>
        <div>{maxPlayers}</div>

        <button
          onClick={() => {
            setModalAction(() => () => {
              if (id) mutate(id)
            })
            setIsModalOpen(true)
          }}
          disabled={isDeleting}
          className={`bg-btn-danger flex items-center gap-2 rounded px-3 py-2 text-white hover:bg-red-700 ${isDeleting ? 'bg-slate-950' : ''}`}
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
