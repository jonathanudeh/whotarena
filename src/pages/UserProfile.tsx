import { IoArrowBack, IoLogOut } from 'react-icons/io5'
import StatCard from '../features/user/StatCard'
import { formatCurrency } from '../utils/helper'
import Button from '../components/Button'
import { useLogOut } from '../features/auth/useLogOut'
import SpinnerMini from '../components/SpinnerMini'
import { useUserProfile } from '../features/user/useUserProfile'
import { useUser } from '../features/auth/useUser'
import EditableUsername from '../features/user/EditableUsername'
import AvatarMenu from '../features/user/AvatarMenu'

function UserProfile() {
  const { logOut, isLoggingOut } = useLogOut()

  const { userProfile = {}, isLoadingUserProfile } = useUserProfile()
  const { user = {} } = useUser()
  const { email } = user
  const { username, avatar, gamesPlayed, gamesWon, rank, totalEarnings } = userProfile

  if (isLoadingUserProfile) return <SpinnerMini />

  return (
    <div className="space-y-6 px-4">
      <div className="bg-card-bg border-border/20 flex flex-col items-center justify-center rounded-3xl border p-6 text-center">
        {/* <div className="border-border/50 mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4">
          <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
        </div> */}
        <AvatarMenu avatarUrl={avatar} />
        <EditableUsername initialName={username} />
        <p className="font-medium text-slate-200/50">{email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Games Played" value={gamesPlayed} />
        <StatCard label="Games Won" value={gamesWon} />
        <StatCard label="Rank" value={`${rank || '0 ranks'}`} />
        <StatCard label="Total Earnings" value={formatCurrency(totalEarnings)} />
      </div>

      <Button size="large" variation="logOut" disabled={isLoggingOut} onClick={logOut}>
        <IoLogOut /> {isLoggingOut ? <SpinnerMini /> : 'Log out'}
      </Button>
    </div>
  )
}

export default UserProfile
