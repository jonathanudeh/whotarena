import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { IoWallet, IoAdd } from 'react-icons/io5'
import { LuMenu } from 'react-icons/lu'
import { useUserProfile } from '../features/user/useUserProfile'

interface HeaderProps {
  onNavbarOpen: (value: boolean) => void
}

function Header({ onNavbarOpen }: HeaderProps) {
  const { userProfile = {} } = useUserProfile()
  const { avatar } = userProfile

  return (
    <header className="bg-background sticky top-0 z-40 flex items-center justify-between border-b border-b-slate-500 p-4 backdrop-blur-sm">
      <Link
        to="/profile"
        className="border-avatar-border bg-avatar-bg h-14 w-14 overflow-hidden rounded-xl border-4 md:hidden"
      >
        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
      </Link>

      <Link
        to="wallet"
        className="flex items-center gap-2 rounded-full border border-[#6F41E2]/20 bg-[#1D1533] px-6 py-3 shadow-lg"
      >
        <IoWallet className="h-5 w-5 text-white" />
        <span className="text-lg font-bold text-white">₦ 670</span>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-white"
        >
          <IoAdd className="h-5 w-5" />
        </motion.div>
      </Link>
      <button className="md:hidden" onClick={() => onNavbarOpen(true)}>
        <LuMenu size={30} />
      </button>
    </header>
  )
}

export default Header
