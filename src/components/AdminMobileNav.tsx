import { LuX } from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
import {
  LuLayoutDashboard,
  LuDoorOpen,
  LuTrophy,
  LuWallet,
  LuUsers,
  LuSettings
} from 'react-icons/lu'
import { useUserProfile } from '../features/user/useUserProfile'
import { BiHome } from 'react-icons/bi'

interface AdminMobileNavProps {
  onNavbarOpen: (value: boolean) => void
}

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LuLayoutDashboard, end: true },
  { label: 'Lobby', to: '/', icon: BiHome },
  { label: 'Rooms', to: '/admin/rooms', icon: LuDoorOpen },
  { label: 'Tournaments', to: '/admin/tournaments', icon: LuTrophy },
  { label: 'Transactions', to: '/admin/transactions', icon: LuWallet },
  { label: 'Users', to: '/admin/users', icon: LuUsers },
  { label: 'Settings', to: '/admin/settings', icon: LuSettings }
]

function AdminMobileNav({ onNavbarOpen }: AdminMobileNavProps) {
  const { userProfile = {} } = useUserProfile()
  const { avatar } = userProfile

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => onNavbarOpen(false)}
      ></div>

      <aside
        className={`border-r-border-s fixed top-0 left-0 z-50 flex h-full w-2/3 transform flex-col gap-5 border-r-[0.8px] bg-slate-950 p-6 text-slate-50 transition-transform md:hidden`}
      >
        <div className="flex justify-between">
          <div className="border-avatar-border bg-avatar-bg h-10 w-10 overflow-hidden rounded-lg border-4">
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          </div>
          <button onClick={() => onNavbarOpen(false)}>
            <LuX size={26} />
          </button>
        </div>

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
      </aside>
    </>
  )
}

export default AdminMobileNav
