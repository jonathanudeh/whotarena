import { LuTrash2 } from 'react-icons/lu'
import { useDeleteTournament } from '../../../hooks/useDeleteTournament'
import type { FetchedTournament } from '../../../types/tournament'
import { useState } from 'react'
import ConfirmModal from '../../../components/ConfirmModal'
import { formatDateOnly } from '../../../utils/helper'

interface Props {
  tournament: FetchedTournament
}

export default function TournamentRowMobile({ tournament }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<() => void>(() => {})

  const { deleteTournament, isDeleting } = useDeleteTournament()

  const { id, image, name, entryFee, prize, maxPlayers, startAt, endAt } = tournament

  return (
    <>
      <div className="mt-3 space-y-2 rounded-lg border border-slate-700 bg-slate-900 p-4 md:hidden">
        <p className="text-center text-lg font-bold">{name}</p>

        <div className="">
          <img src={image} alt="Tournament image" className="aspect-video w-full object-cover" />
        </div>

        <p className="text-slate-300">
          Entry Fee: <span className="text-white">₦{entryFee}</span>
        </p>

        <p className="text-slate-300">
          Prize: <span className="text-white">₦{prize}</span>
        </p>

        <p className="text-slate-300">
          Max Players: <span className="text-white">{maxPlayers}</span>
        </p>
        <p className="text-slate-300">
          Start date: <span className="text-white">{formatDateOnly(startAt)}</span>
        </p>
        <p className="text-slate-300">
          End date: <span className="text-white">{formatDateOnly(endAt)}</span>
        </p>

        <button
          onClick={() => {
            setModalAction(() => () => {
              if (id) deleteTournament(id)
            })
            setIsModalOpen(true)
          }}
          disabled={isDeleting}
          className={`bg-btn-danger flex w-full cursor-pointer items-center justify-center gap-2 rounded px-3 py-2 font-semibold ${isDeleting ? 'bg-slate-950' : 'hover:bg-red-700'}`}
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
