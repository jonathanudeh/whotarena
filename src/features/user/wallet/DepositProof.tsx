import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { IoCard, IoSend } from 'react-icons/io5'
import { useUser } from '../../auth/useUser'
import { useUploadDeposit } from './useUploadDeposit'
import SpinnerMini from '../../../components/SpinnerMini'

function DepositProof() {
  const [amount, setAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const { user } = useUser()
  const { uploadDeposit, isUploadingDeposit } = useUploadDeposit()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!amount || !file) {
      toast.error('Amount and proof are required')
      return
    }

    if (!user?.id) {
      toast.error('You must be logged in')
      return
    }

    const info = {
      userId: user?.id,
      type: 'depositRequest',
      status: 'pending'
    }

    uploadDeposit(
      { amount: Number(amount), imgFileProof: file, info },
      {
        onSettled: () => {
          setAmount('')
          setFile(null)
          setPreviewUrl('')
        }
      }
    )
  }

  return (
    <div className="bg-card-bg space-y-4 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-green-400">Submit Deposit</h3>

      {isUploadingDeposit ? (
        <SpinnerMini />
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background border-border/30 focus:border-border w-full rounded-xl border-2 px-4 py-3 text-white placeholder-gray-400 outline-none"
          />

          <div className="rounded-xl border-2 border-dashed border-yellow-400/30 p-6 text-center">
            <IoCard className="mx-auto mb-2 h-12 w-12 text-green-400" />
            <p className="mb-2 text-sm text-gray-300">Upload Payment Proof</p>
            <input
              type="file"
              className="hidden"
              id="proof"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null
                setFile(selected)

                if (selected) {
                  setPreviewUrl(URL.createObjectURL(selected))
                }
              }}
            />
            <label htmlFor="proof" className="cursor-pointer text-sm font-medium text-green-400">
              Choose File
            </label>

            {file && <p className="mt-2 text-xs text-green-300">Selected: {file.name}</p>}

            {previewUrl && (
              <img
                src={previewUrl}
                alt="proof preview"
                className="mx-auto mt-3 h-20 w-20 rounded-lg object-cover"
              />
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-main-text flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-green-700 to-green-800 py-4 font-bold"
          >
            <IoSend className="h-5 w-5" />
            Submit Request
          </motion.button>
        </form>
      )}
    </div>
  )
}

export default DepositProof
