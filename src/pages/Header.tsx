import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IoWallet, IoAdd, IoSettings } from 'react-icons/io5'

function Header() {
  const user = {
    name: 'Player_123',
    email: 'player@whotarena.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    gamesPlayed: 45,
    gamesWon: 28,
    winRate: 62,
    totalEarnings: 150000
  }

  return (
    <div>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-red-950/80 p-4 backdrop-blur-sm">
        <Link
          to="/profile"
          className="h-14 w-14 overflow-hidden rounded-xl border-4 border-yellow-400 bg-yellow-500"
        >
          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
        </Link>

        <Link
          to="wallet"
          className="flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-500 to-yellow-400 px-6 py-3 shadow-lg"
        >
          <IoWallet className="h-5 w-5 text-red-900" />
          <span className="text-lg font-bold text-red-900">₦ 670</span>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-white"
          >
            <IoAdd className="h-5 w-5" />
          </motion.div>
        </Link>

        <Link
          to="/settings"
          className="flex h-14 w-14 items-center justify-center rounded-xl border-4 border-yellow-400 bg-yellow-500"
        >
          <IoSettings className="h-7 w-7 text-red-900" />
        </Link>
      </header>
    </div>
  )
}

export default Header
