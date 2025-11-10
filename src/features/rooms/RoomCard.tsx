import { motion } from 'framer-motion'

import { LuClock, LuDoorOpen, LuUsers } from 'react-icons/lu'
import { formatCurrency } from '../../utils/helper'

function RoomCard({ room, delay }) {
  const { name, entryFee, prize, maxPlayers } = room

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1 }}
      className={`'border shadow-[0_0_15px_-4px_rgba(111,65,226,0.35)]' overflow-hidden rounded-xl border-[#6F41E2]/20 bg-[#1D1533] shadow-2xl`}
    >
      <div className="rounded-xl border border-[#6F41E2]/20 bg-[#1D1533] p-4 shadow-[0_0_25px_-4px_rgba(111,65,226,0.35)]">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">{name}</h2>
          <div className="flex items-center gap-1 text-sm text-[#8F62FF]">
            <LuClock /> <span>12:45</span>
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
          {maxPlayers + 7}
          <span className="font-bold text-[#6F41E2]">+</span>
        </div>

        {/*  */}
        <button className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#00D57E] py-2 font-semibold text-[#0B1F16] hover:bg-[#1DF59C]">
          <LuDoorOpen size={20} /> Join Room
        </button>
      </div>
    </motion.li>
  )
}

export default RoomCard
