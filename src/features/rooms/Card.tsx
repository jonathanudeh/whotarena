import { IoPeople, IoTime, IoTrophy } from 'react-icons/io5'
import { motion } from 'framer-motion'

// interface CardProps {
//   room: {}
//   delay: number
// }

function RoomCard({ room, delay }) {
  const isTournament = room.type === 'tournament'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={`overflow-hidden rounded-xl shadow-2xl ${
        isTournament
          ? 'bg-linear-to-br from-yellow-500 via-yellow-400 to-yellow-500'
          : 'bg-linear-to-br from-yellow-400 to-yellow-300'
      }`}
    >
      {isTournament ? (
        <div className="flex items-center justify-between gap-2 p-1">
          <div className="flex w-full flex-col gap-4 rounded-lg bg-[url(/assets/tournament-bg.png)] bg-cover bg-no-repeat p-2">
            <div>
              <h3 className="mb-1 text-xl font-bold text-yellow-300">Whot</h3>
              <h4 className="text-lg font-bold text-yellow-300">Naira League</h4>
              <div className="h-0.5 w-15 bg-yellow-300"></div>
            </div>
            <div className="">
              <div className="flex">
                <IoTrophy className="h-5 w-5 text-white" />
                <p className="text-sm font-medium text-white">First Prize</p>
              </div>
              <p className="text-3xl font-black text-yellow-300">₦ {room.prize.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex w-6/7 flex-col gap-2">
            <div className="rounded-sm bg-red-700 px-1 py-2 text-xs font-bold text-white">
              Closes in {room.timeLeft}
            </div>

            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-yellow-600">
                <motion.div
                  className="h-full rounded-full bg-red-700"
                  initial={{ width: 0 }}
                  animate={{ width: `${(room.players / room.maxPlayers) * 100}%` }}
                  transition={{ duration: 1, delay: delay + 0.3 }}
                />
              </div>
              <p className="font-medium text-red-900">
                {room.players} of {room.maxPlayers} filled
              </p>
            </div>

            <div className="">
              <p className="text-sm font-bold text-red-800">Entry Fee</p>
              <button className="cursor-pointer rounded-lg bg-red-700 px-8 py-2 text-center text-xl font-black text-yellow-400">
                ₦ {room.entryFee}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-red-600 px-2 pb-2">
          <div className="relative mb-3 flex items-center justify-end">
            <div className="flex flex-col items-center gap-2 text-red-900">
              <IoPeople className="h-6 w-6" />
              <span className="text-xs font-bold">{room.maxPlayers} Players</span>
            </div>
            <div className="self-start rounded-sm bg-red-700/50 px-3 py-1 text-xs font-bold text-white">
              7:00 PM - 2:00 AM
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="mb-1 text-xs font-medium text-red-800">Prize</p>
              <p className="rounded-sm bg-linear-to-r from-orange-500 to-orange-400 p-2 text-xl font-black text-white">
                ₦ {room.prize.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-sm bg-red-400/50 px-3 py-1">
              <IoTime className="mb-1 h-6 w-6 text-red-800" />
              <span className="font-bold text-red-900">{room.timeLeft}</span>
            </div>

            <div className="text-center">
              <p className="mb-1 text-xs font-medium text-red-800">Entry Fee</p>
              <button className="rounded-sm bg-linear-to-r from-red-800 to-red-700 px-4 py-2 text-xl font-black text-white">
                ₦{room.entryFee.toLocaleString()}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-red-800">
            <IoPeople className="h-5 w-5" />
            <span className="font-bold">{room.currentPlayers}+</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default RoomCard
