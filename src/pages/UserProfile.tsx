import { IoArrowBack, IoLogOut } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import StatCard from '../features/user/StatCard'
import { formatCurrency } from '../utils/helper'

function UserProfile() {
  const navigate = useNavigate()
  const user = {
    name: 'Player_123',
    email: 'player@whotarena.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    gamesPlayed: 45,
    gamesWon: 28,
    winRate: 62,
    totalEarnings: 150000
  }
  // bg-linear-to-r from-yellow-500 to-yellow-400

  return (
    <div className="space-y-6 px-4">
      <div className="bg-card-bg border-border/20 rounded-3xl border p-6 text-center">
        <div className="border-border/50 mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4">
          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
        </div>
        <h2 className="text-slate- text-2xl font-black">{user.name}</h2>
        <p className="font-medium text-slate-200">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Games Played" value={user.gamesPlayed} />
        <StatCard label="Games Won" value={user.gamesWon} />
        <StatCard label="Win Rate" value={`${user.winRate}%`} />
        <StatCard label="Total Earnings" value={formatCurrency(user.totalEarnings)} />
      </div>

      <Link
        to="/login"
        className="bg-card-bg flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white"
      >
        <IoLogOut className="h-5 w-5" />
        Logout
      </Link>
    </div>
  )
}

export default UserProfile

{
  /* <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-yellow-400">
          <IoArrowBack className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div> */
}
