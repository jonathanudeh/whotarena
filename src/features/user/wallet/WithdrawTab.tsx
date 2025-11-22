import { motion } from 'framer-motion'

function WithdrawTab() {
  return (
    <div className="space-y-4">
      <div className="bg-card-bg space-y-4 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-green-400">Withdraw Funds</h3>
        <input
          type="number"
          placeholder="Enter amount"
          className="bg-background focus:border-border border-border/30 w-full rounded-xl border-2 px-4 py-3 text-white placeholder-gray-400 outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-main-text w-full rounded-xl bg-green-700 py-4 font-bold"
        >
          Request Withdrawal
        </motion.button>
      </div>
    </div>
  )
}

export default WithdrawTab
