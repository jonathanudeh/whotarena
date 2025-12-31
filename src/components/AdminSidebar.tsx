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

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LuLayoutDashboard, end: true },
  { label: 'Lobby', to: '/', icon: BiHome },
  { label: 'Rooms', to: '/admin/rooms', icon: LuDoorOpen },
  { label: 'Tournaments', to: '/admin/tournaments', icon: LuTrophy },
  { label: 'Transactions', to: '/admin/transactions', icon: LuWallet },
  { label: 'Users', to: '/admin/users', icon: LuUsers },
  { label: 'Settings', to: '/admin/settings', icon: LuSettings }
]
function AdminSidebar() {
  const { userProfile = {} } = useUserProfile()
  const { avatar } = userProfile

  return (
    <aside className="bg-background border-r-border-s row-span-full hidden flex-col gap-10 border-r-[0.8px] p-6 md:flex">
      <div className="border-avatar-border bg-avatar-bg h-14 w-14 overflow-hidden rounded-xl border-4">
        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
      </div>
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
    </aside>
  )
}

export default AdminSidebar
