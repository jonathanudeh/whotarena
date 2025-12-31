import { IoDocument, IoInformation, IoPerson } from 'react-icons/io5'
import { useUserProfile } from '../features/user/useUserProfile'
import SpinnerMini from '../components/SpinnerMini'
import SettingsItem from '../components/SettingsItem'

function Settings() {
  const { userProfile: { isAdmin } = {}, isLoadingUserProfile } = useUserProfile()

  return (
    <div className="px-6">
      <div className="space-y-4">
        <SettingsItem icon={IoDocument} text="Terms & Conditions" to="" />
        <SettingsItem icon={IoInformation} text="About WhotArena" to="" />
        {isLoadingUserProfile ? (
          <SpinnerMini />
        ) : isAdmin ? (
          <SettingsItem icon={IoPerson} text="Admin Panel" to="/Admin" />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default Settings
