import { motion } from 'framer-motion'

import { LuClock, LuDoorOpen, LuUsers } from 'react-icons/lu'
import { formatCurrency, formatTime } from '../../utils/helper'
import toast from 'react-hot-toast'
import { useUser } from '../auth/useUser'
import SpinnerMini from '../../components/SpinnerMini'
import { useAvailableBalance } from '../user/wallet/useAvailableBalance'
import { useNavigate } from 'react-router-dom'
import { useJoinWithEntryFee } from './useJoinWithEntryFee'
import { usePlayersCount } from '../../hooks/usePlayersCount'

type RoomCardProps = {
  room: {
    id: number
    name: string
    entryFee: number
    prize: number
    maxPlayers: number
    created_at: string
  }
  delay: number
}

function RoomCard({ room, delay }: RoomCardProps) {
  const navigate = useNavigate()
  const { id: roomId, name, entryFee, prize, maxPlayers, created_at } = room
  const { user, isAuthenticated } = useUser()
  const { availableBalance, isLoadingBalance } = useAvailableBalance()
  const { joinWithFee, retryJoin, isJoining, error, canRetryJoin } = useJoinWithEntryFee()
  const userId = user?.id

  const playersCount = usePlayersCount(roomId)

  async function handleJoinRoom() {
    try {
      if (!userId || !isAuthenticated) return

      // Check if balance is still loading
      if (isLoadingBalance) {
        toast.loading('Checking wallet balance... please wait.')
        return
      }

      // Ensure balance is available, default to 0 if undefined
      const balance = availableBalance ?? 0

      if (balance < entryFee) {
        const shortfall = entryFee - balance
        toast.error(`Insufficient balance. You need ${formatCurrency(shortfall)} more.`)
        setTimeout(() => {
          navigate('/wallet')
        }, 1500)

        return
      }

      // Proceed with joining: deduct fee → join → handle failure
      await joinWithFee({ roomId, userId, entryFee })
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
        console.log(err)
      } else {
        toast.error('An unknown error occurred')
        console.log(err)
      }
    }
  }

  function handleRetryJoin() {
    if (!userId) return
    retryJoin(roomId, userId, entryFee)
  }

  if (isJoining) return <SpinnerMini />

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1 }}
      className={`w-full overflow-hidden rounded-xl border border-[#6F41E2]/20 bg-[#1D1533] shadow-[0_0_15px_-4px_rgba(111,65,226,0.35)]`}
    >
      <div className="rounded-xl border border-[#6F41E2]/20 bg-[#1D1533] p-4 shadow-[0_0_25px_-4px_rgba(111,65,226,0.35)]">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-100 capitalize">{name}</h2>
          <div className="flex items-center gap-1 text-sm text-[#8F62FF]">
            <LuClock /> <span>{formatTime(created_at)}</span>
          </div>
        </div>

        {/*  */}
        <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-[#6F41E2]/30 bg-[#251A42] px-2 py-0.5 text-xs text-[#A78BFA]">
          <LuUsers className="text-[#A78BFA]" /> {maxPlayers} Players
        </div>

        {/*  */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#E2C044]/30 bg-[#2A2600] px-3 py-2">
            <p className="text-xs text-[#E2C044]">Prize Pool</p>
            <p className="text-lg font-bold text-[#F4D03F]">{formatCurrency(prize)}</p>
          </div>

          <div className="rounded-xl border border-[#6F41E2]/30 bg-[#2A1F4A] px-3 py-2">
            <p className="text-xs text-[#A78BFA]">Entry Fee</p>
            <p className="text-lg font-bold text-white">{formatCurrency(entryFee)}</p>
          </div>
        </div>

        {/*  */}
        <div className="mt-3 flex items-center justify-center gap-2 text-center text-sm text-white">
          <LuUsers className="text-[#A78BFA]" />
          <motion.span
            key={playersCount}
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {playersCount}
          </motion.span>

          <span className="font-bold text-[#6F41E2]">+</span>
        </div>

        {/*  */}
        {canRetryJoin ? (
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FF6B6B] py-2 font-semibold text-white hover:bg-[#ff5252]"
              onClick={handleRetryJoin}
              disabled={isJoining}
            >
              <LuDoorOpen size={20} /> Retry Join
            </button>
            <p className="text-center text-xs text-red-400">{error}</p>
          </div>
        ) : (
          <button
            className={`mt-4 flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#00D57E] py-2 font-semibold text-[#0B1F16] hover:bg-[#1DF59C] ${isJoining ? 'bg-card-bg cursor-not-allowed opacity-70' : ''}`}
            onClick={handleJoinRoom}
            disabled={isJoining}
          >
            <LuDoorOpen size={20} /> Join Room
          </button>
        )}
      </div>
    </motion.li>
  )
}

export default RoomCard
