import { NavLink } from 'react-router-dom'
import {
  LuLayoutDashboard,
  LuDoorOpen,
  LuTrophy,
  LuWallet,
  LuUsers,
  LuSettings
} from 'react-icons/lu'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LuLayoutDashboard, end: true },
  { label: 'Rooms', to: '/admin/rooms', icon: LuDoorOpen },
  { label: 'Tournaments', to: '/admin/tournaments', icon: LuTrophy },
  { label: 'Transactions', to: '/admin/transactions', icon: LuWallet },
  { label: 'Users', to: '/admin/users', icon: LuUsers },
  { label: 'Settings', to: '/admin/settings', icon: LuSettings }
]
function AdminSidebar() {
  return (
    <aside className="bg-background border-r-border-s row-span-full hidden flex-col gap-10 border-r-[0.8px] p-6 md:flex">
      <div>Admin sidebar</div>

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
