import { IoArrowBack, IoDocument, IoInformation, IoNotifications, IoPerson } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

function Settings() {
  return (
    <div className="px-6">
      <div className="space-y-4">
        <SettingsItem icon={IoNotifications} text="Notifications" to="" />
        <SettingsItem icon={IoDocument} text="Terms & Conditions" to="" />
        <SettingsItem icon={IoInformation} text="About WhotArena" to="" />
        <SettingsItem icon={IoPerson} text="Admin Panel" to="/Admin" />
      </div>
    </div>
  )
}

export default Settings

function SettingsItem({ icon: Icon, text, to }) {
  return (
    <Link
      to={to}
      className="bg-card-bg flex w-full items-center gap-4 rounded-xl p-4 hover:bg-red-800"
    >
      <Icon className="h-6 w-6 text-green-400" />
      <span className="font-medium">{text}</span>
    </Link>
  )
}
