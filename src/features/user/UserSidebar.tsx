import { Link, NavLink } from 'react-router-dom'
import { LuLayoutDashboard, LuTrophy, LuWallet, LuSettings, LuUser } from 'react-icons/lu'
import LogOut from '../auth/LogOut'
import { useUserProfile } from './useUserProfile'

const navItems = [
  { label: 'Lobby', to: '/', icon: LuLayoutDashboard, end: true },
  { label: 'Wallet', to: '/wallet', icon: LuWallet },
  { label: 'Tournament', to: '/tournament', icon: LuTrophy },
  { label: 'Profile', to: '/profile', icon: LuUser },
  { label: 'Settings', to: '/settings', icon: LuSettings }
]

//  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'

function UserSidebar() {
  const { userProfile = {} } = useUserProfile()
  const { avatar } = userProfile

  return (
    <aside className="border-r-border-s row-span-full hidden flex-col gap-10 border-r-[0.8px] bg-slate-950 p-6 md:flex">
      <Link
        to="/profile"
        className="border-avatar-border bg-avatar-bg h-14 w-14 overflow-hidden rounded-xl border-4"
      >
        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
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

      <LogOut />
    </aside>
  )
}

export default UserSidebar
