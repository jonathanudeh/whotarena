import { motion } from 'framer-motion'

export type TabType = 'deposit' | 'withdraw'
interface ActiveTabProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

function ActiveTab({ setActiveTab, activeTab }: ActiveTabProps) {
  return (
    <div className="flex gap-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab('deposit')}
        className={`flex-1 rounded-xl py-3 font-bold transition-colors ${
          activeTab === 'deposit' ? 'text-main-text bg-green-700' : 'bg-card-bg text-main-text'
        }`}
      >
        Deposit
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab('withdraw')}
        className={`flex-1 rounded-xl py-3 font-bold transition-colors ${
          activeTab === 'withdraw' ? 'text-main-text bg-green-700' : 'bg-card-bg text-main-text'
        }`}
      >
        Withdraw
      </motion.button>
    </div>
  )
}

export default ActiveTab
