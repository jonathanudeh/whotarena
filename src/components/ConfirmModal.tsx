import { AiOutlineClose } from 'react-icons/ai'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  disabled: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  disabled
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-sm rounded-lg bg-gray-900 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <AiOutlineClose size={20} />
        </button>

        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="mb-5 text-gray-300">{message}</p>

        <div className="flex justify-end gap-3">
          <button className="rounded bg-gray-700 px-4 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>

          <button
            className="rounded bg-green-600 px-4 py-2 text-sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            disabled={disabled}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
