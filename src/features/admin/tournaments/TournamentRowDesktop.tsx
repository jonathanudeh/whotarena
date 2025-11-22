import { LuTrash2 } from 'react-icons/lu'
import { useDeleteTournament } from '../../../hooks/useDeleteTournament'
import type { FetchedTournament } from '../../../types/tournament'
import { useState } from 'react'
import ConfirmModal from '../../../components/ConfirmModal'
import { formatDateOnly } from '../../../utils/helper'

interface Props {
  tournament: FetchedTournament
}

export default function TournamentRowDesktop({ tournament }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<() => void>(() => {})

  const { deleteTournament, isDeleting } = useDeleteTournament()

  const { id, image, name, entryFee, prize, maxPlayers, startAt, endAt } = tournament

  return (
    <>
      <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 rounded border-b border-slate-800 bg-slate-900 px-4 py-3 md:grid">
        <div className="flex h-15 w-15 items-center justify-center">
          <img src={image} alt="Tournament image" className="aspect-video" />
        </div>
        <div>{name}</div>
        <div>₦{entryFee}</div>
        <div>₦{prize}</div>
        <div>{maxPlayers}</div>
        <div>{formatDateOnly(startAt)}</div>
        <div>{formatDateOnly(endAt)}</div>

        <button
          onClick={() => {
            setModalAction(() => () => {
              if (id) deleteTournament(id)
            })
            setIsModalOpen(true)
          }}
          className={`bg-btn-danger flex cursor-pointer items-center gap-1 rounded px-2 py-2 text-white ${isDeleting ? 'bg-slate-950' : 'hover:bg-red-700'}`}
          disabled={isDeleting}
        >
          <LuTrash2 size={18} />
        </button>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Are you sure?"
        message="This action cannot be undone."
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
        disabled={isDeleting}
      />
    </>
  )
}
