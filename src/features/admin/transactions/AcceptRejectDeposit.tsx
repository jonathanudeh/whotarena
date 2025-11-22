import { useState } from 'react'
import SpinnerMini from '../../../components/SpinnerMini'
import { useApproveDeposit } from './useApproveDeposit'
import { useGetPendingDeposits } from './useGetPendingDeposits'
import { useRejectDeposit } from './useRejectDeposit'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import Button from '../../../components/Button'
import ConfirmModal from '../../../components/ConfirmModal'
import { formatCurrency } from '../../../utils/helper'

function AcceptRejectDeposit() {
  const { getPendingDeposits = [], isGettingDeposits } = useGetPendingDeposits()
  const { approveDeposit, isAccepting } = useApproveDeposit()
  const { rejectDeposit, isRejecting } = useRejectDeposit()
  const isAction = isAccepting || isRejecting

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<() => void>(() => {})

  if (!getPendingDeposits.length && !isGettingDeposits)
    return <p className="text-center">No deposits to confirm</p>
  if (isGettingDeposits) return <SpinnerMini />

  return (
    <>
      <div className="w-full space-y-2">
        {/* HEADER */}
        <div className="grid grid-cols-[20px_40px_1fr_1fr_80px_40px] items-center px-2 py-2 text-xs font-semibold text-gray-400 uppercase">
          <p>#</p>
          <p>Img</p>
          <p>Username</p>
          <p>Email</p>
          <p>Amount</p>
          <p></p>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-gray-800">
          {getPendingDeposits.map((deposit, index) => {
            const { id, userId, imageProof, username, email, amount } = deposit
            const isOpen = expandedId === id

            return (
              <div key={id} className="py-2">
                {/* MAIN ROW */}
                <div className="grid grid-cols-[20px_40px_1fr_1fr_80px_40px] items-center gap-3 px-2 py-2 transition hover:bg-gray-800/30">
                  <p className="text-sm text-gray-300">{index + 1}</p>

                  <img
                    src={imageProof}
                    alt="proof"
                    className="h-10 w-10 cursor-pointer rounded object-cover"
                    onClick={() => setPreviewImage(imageProof)}
                  />

                  <p className="truncate text-sm font-medium">{username}</p>
                  <p className="truncate text-sm text-gray-400">{email}</p>
                  <p className="truncate text-sm">{formatCurrency(amount)}</p>

                  <button
                    onClick={() => setExpandedId(isOpen ? null : id)}
                    className="mx-auto px-4 text-gray-300"
                  >
                    {isOpen ? (
                      <HiChevronUp className="h-5 w-5" />
                    ) : (
                      <HiChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* EXPANDED AREA */}
                {isOpen && (
                  <div className="mt-2 space-y-3 rounded-lg bg-gray-900/40 p-4 text-sm">
                    <p>
                      <span className="text-gray-400">username:</span> {username}
                    </p>
                    <p>
                      <span className="text-gray-400">Email:</span> {email}
                    </p>
                    <p>
                      <span className="text-gray-400">User ID:</span> {userId}
                    </p>
                    <p>
                      <span className="text-gray-400">Amount:</span> ₦{amount}
                    </p>

                    <img
                      src={imageProof}
                      alt="proof-large"
                      className="mt-2 h-40 w-auto cursor-pointer rounded-lg object-contain"
                      onClick={() => setPreviewImage(imageProof)}
                    />

                    <div className="mt-3 flex gap-3">
                      {/* APPROVE BUTTON */}
                      <Button
                        onClick={() => {
                          setModalAction(() => () => approveDeposit(id))
                          setIsModalOpen(true)
                        }}
                        disabled={isAction}
                      >
                        <FiCheckCircle /> Approve
                      </Button>

                      {/* REJECT BUTTON */}
                      <Button
                        variation="danger"
                        onClick={() => {
                          setModalAction(() => () => rejectDeposit(id))
                          setIsModalOpen(true)
                        }}
                        disabled={isAction}
                      >
                        <FiXCircle /> Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Are you sure?"
        message="This action cannot be undone."
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
        disabled={isAction}
      />

      {/* FULLSCREEN IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" className="max-h-[90%] max-w-[90%] rounded-xl" />
        </div>
      )}
    </>
  )
}

export default AcceptRejectDeposit
