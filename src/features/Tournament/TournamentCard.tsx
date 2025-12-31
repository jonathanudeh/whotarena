import { motion } from 'framer-motion'
import { IoTrophy } from 'react-icons/io5'
import { formatCurrency } from '../../utils/helper'

type TournamentCardProps = {
  tournament: {
    id: number
    name: string
    entryFee: number
    prize: number
    maxPlayers: number
    created_at: string
    image: string
    startAt: string
    endAt: string
  }
}

function TournamentCard({ tournament }: TournamentCardProps) {
  const { name, entryFee, prize, maxPlayers, image, startAt, endAt } = tournament

  return (
    <li className="relative w-full min-w-[85%] snap-start overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:w-100 md:min-w-[420px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image || '/assets/tournament-bg.png'})`
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/60 to-black/40" />

      {/* Foreground content */}
      <div className="relative flex flex-col gap-4 p-5 text-white">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-wide">{name}</h3>
          <IoTrophy className="text-2xl text-yellow-400 drop-shadow-md" />
        </div>

        {/* Prize & Entry */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Prize Pool</p>
            <p className="text-xl font-bold text-yellow-300">{formatCurrency(prize)}</p>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Entry Fee</p>
            <p className="text-xl font-bold text-purple-300">{formatCurrency(entryFee)}</p>
          </div>
        </div>

        {/* Start & End */}
        <div className="space-y-1 text-sm text-white/70">
          <p>Starts: {new Date(startAt).toLocaleString()}</p>
          <p>Ends: {new Date(endAt).toLocaleString()}</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="mb-1 flex justify-between text-xs text-white/70">
            <span>Participants</span>
            <span>
              {maxPlayers - 50}/{maxPlayers}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((maxPlayers - 50) / maxPlayers) * 100}%`
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Button */}
        <button className="mt-3 w-full rounded-lg bg-purple-600 py-2 text-center font-bold transition hover:bg-purple-700">
          Register
        </button>
      </div>
    </li>
  )
}

export default TournamentCard
