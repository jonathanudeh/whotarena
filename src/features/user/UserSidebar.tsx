import { Link, NavLink } from 'react-router-dom'
import { LuLayoutDashboard, LuTrophy, LuWallet, LuSettings, LuUser, LuLogOut } from 'react-icons/lu'

const navItems = [
  { label: 'Lobby', to: '/', icon: LuLayoutDashboard, end: true },
  { label: 'Wallet', to: '/wallet', icon: LuWallet },
  { label: 'Tournament', to: '/tournament', icon: LuTrophy },
  { label: 'Profile', to: '/profile', icon: LuUser },
  { label: 'Settings', to: '/settings', icon: LuSettings }
]

const user = {
  name: 'Player_123',
  email: 'player@whotarena.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  gamesPlayed: 45,
  gamesWon: 28,
  winRate: 62,
  totalEarnings: 150000
}

function UserSidebar() {
  return (
    <aside className="border-r-border-s row-span-full hidden flex-col gap-10 border-r-[0.8px] bg-slate-950 p-6 md:flex">
      <Link
        to="/profile"
        className="h-14 w-14 overflow-hidden rounded-xl border-4 border-yellow-400 bg-yellow-500"
      >
        <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 transition hover:bg-slate-800 ${
                  isActive ? 'bg-slate-700 font-semibold' : 'text-slate-200'
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <NavLink to="/login" className="flex items-center gap-2">
        <LuLogOut size={20} />
        Logout
      </NavLink>
    </aside>
  )
}

export default UserSidebar
