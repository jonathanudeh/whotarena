import EditableUsername from '../features/user/EditableUsername'
import AvatarMenu from '../features/user/AvatarMenu'
import AllStat from '../features/user/AllStat'
import LogOut from '../features/auth/LogOut'

function UserProfile() {
  return (
    <div className="space-y-6 px-4">
      <div className="bg-card-bg border-border/20 flex flex-col items-center justify-center rounded-3xl border p-6 text-center">
        <AvatarMenu />
        <EditableUsername />
      </div>

      <AllStat />

      <LogOut isProfile={true} />
    </div>
  )
}

export default UserProfile
