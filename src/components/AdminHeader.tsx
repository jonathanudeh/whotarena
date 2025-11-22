import { LuMenu } from 'react-icons/lu'
import { useUserProfile } from '../features/user/useUserProfile'

interface AdminHeaderProps {
  onNavbarOpen: (value: boolean) => void
}

function AdminHeader({ onNavbarOpen }: AdminHeaderProps) {
  const { userProfile = {} } = useUserProfile()
  const { avatar } = userProfile

  return (
    <header className="flex items-center justify-between gap-5 border-b border-b-slate-500 p-6">
      <div className="border-avatar-border bg-avatar-bg h-10 w-10 overflow-hidden rounded-lg border-4 md:hidden">
        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
      </div>
      <button className="md:hidden" onClick={() => onNavbarOpen(true)}>
        <LuMenu size={30} />
      </button>
    </header>
  )
}

export default AdminHeader
