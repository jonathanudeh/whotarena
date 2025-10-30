import { IoArrowBack, IoLogOut } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

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

  return (
    <div className="space-y-6 px-4">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-yellow-400">
          <IoArrowBack className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="rounded-3xl bg-linear-to-r from-yellow-500 to-yellow-400 p-6 text-center">
        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-red-900">
          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
        </div>
        <h2 className="text-2xl font-black text-red-900">{user.name}</h2>
        <p className="font-medium text-red-800">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Games Played" value={user.gamesPlayed} />
        <StatCard label="Games Won" value={user.gamesWon} />
        <StatCard label="Win Rate" value={`${user.winRate}%`} />
        <StatCard label="Total Earnings" value={`₦${user.totalEarnings.toLocaleString()}`} />
      </div>

      <Link
        to="/login"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-800/50 py-4 font-bold text-white"
      >
        <IoLogOut className="h-5 w-5" />
        Logout
      </Link>
    </div>
  )
}

export default UserProfile

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-red-800/50 p-4 text-center">
      <p className="mb-1 text-sm text-gray-300">{label}</p>
      <p className="text-2xl font-bold text-yellow-400">{value}</p>
    </div>
  )
}
