import { motion } from 'framer-motion'

// interface CardProps {
//   room: {}
//   delay: number
// }

function Card({ room, delay }) {
  const isTournament = room.type === 'tournament'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={`overflow-hidden rounded-xl shadow-2xl ${
        isTournament
          ? 'border border-[#E2C044]/30 bg-orange-400'
          : 'border border-[#6F41E2]/20 bg-[#1D1533] shadow-[0_0_15px_-4px_rgba(111,65,226,0.35)]'
      }`}
    >
      {isTournament ? <div></div> : <div></div>}
    </motion.div>
  )
}
