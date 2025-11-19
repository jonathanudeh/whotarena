import {
  LuLayoutDashboard,
  LuLogOut,
  LuSettings,
  LuTrophy,
  LuUser,
  LuWallet,
  LuX
} from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
import LogOut from '../auth/LogOut'

interface UserMobileNavProps {
  navbarOpen: boolean
  onNavbarOpen: (value: boolean) => void
}

const navItems = [
  { label: 'Lobby', to: '/', icon: LuLayoutDashboard, end: true },
  { label: 'Wallet', to: '/wallet', icon: LuWallet },
  { label: 'Tournament', to: '/tournament', icon: LuTrophy },
  { label: 'Profile', to: '/profile', icon: LuUser },
  { label: 'Settings', to: '/settings', icon: LuSettings }
]

function UserMobileNav({ navbarOpen, onNavbarOpen }: UserMobileNavProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => onNavbarOpen(false)}
      ></div>

      <aside
        className={`border-l-border-s fixed top-0 right-0 z-50 flex h-full w-2/3 transform flex-col gap-5 border-l-[0.8px] bg-slate-950 p-6 text-slate-50 transition-transform md:hidden`}
      >
        <button onClick={() => onNavbarOpen(false)}>
          <LuX size={26} />
        </button>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => onNavbarOpen(false)}
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
    </>
  )
}

export default UserMobileNav
