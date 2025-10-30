import { motion } from 'framer-motion'
import { IoArrowBack, IoDocument, IoInformation, IoNotifications, IoPerson } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="min-h-screen bg-red-950 p-6"
    >
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-yellow-400">
          <IoArrowBack className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Setting</h1>
      </div>

      <div className="space-y-4">
        <SettingsItem icon={IoNotifications} text="Notifications" to="" />
        <SettingsItem icon={IoDocument} text="Terms & Conditions" to="" />
        <SettingsItem icon={IoInformation} text="About WhotArena" to="" />
        <SettingsItem icon={IoPerson} text="Admin Panel" to="/Admin" />
      </div>
    </motion.div>
  )
}

export default Settings

function SettingsItem({ icon: Icon, text, to }) {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-4 rounded-xl bg-red-800/50 p-4 hover:bg-red-800"
    >
      <Icon className="h-6 w-6 text-yellow-400" />
      <span className="font-medium">{text}</span>
    </Link>
  )
}
