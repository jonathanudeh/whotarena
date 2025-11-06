import { LuMenu } from 'react-icons/lu'

interface AdminHeaderProps {
  onNavbarOpen: (value: boolean) => void
}

function AdminHeader({ onNavbarOpen }: AdminHeaderProps) {
  return (
    <header className="flex items-center gap-5 border-b border-b-slate-500 p-6">
      <button className="md:hidden" onClick={() => onNavbarOpen(true)}>
        <LuMenu size={30} />
      </button>
      admin header
    </header>
  )
}

export default AdminHeader
