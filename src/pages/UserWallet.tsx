import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoArrowBack, IoCard, IoCopy, IoSend } from 'react-icons/io5'

const mockTransactions = [
  { id: 1, type: 'deposit', amount: 5000, status: 'approved', date: '2025-10-28 14:30' },
  { id: 2, type: 'entry_fee', amount: -300, status: 'completed', date: '2025-10-28 15:45' },
  { id: 3, type: 'winnings', amount: 5000, status: 'completed', date: '2025-10-28 16:20' },
  { id: 4, type: 'deposit', amount: 10000, status: 'pending', date: '2025-10-29 09:15' }
]

function UserWallet() {
  const [activeTab, setActiveTab] = useState('deposit')
  const [amount, setAmount] = useState('')
  //   const [proofFile, setProofFile] = useState(null)

  const bankDetails = {
    bank: 'Opay',
    accountNumber: '8105513884',
    accountName: 'WhotArena Limited'
  }

  return (
    <div className="space-y-6 px-4">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => window.history.back()} className="text-yellow-400">
          <IoArrowBack className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Wallet</h1>
      </div>

      <div className="rounded-3xl bg-linear-to-r from-yellow-500 to-yellow-400 p-6 text-center">
        <p className="mb-2 text-sm font-medium text-red-900">Available Balance</p>
        <p className="text-5xl font-black text-red-900">₦ 2205</p>
      </div>

      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 rounded-xl py-3 font-bold transition-colors ${
            activeTab === 'deposit' ? 'bg-yellow-400 text-red-900' : 'bg-red-800/50 text-white'
          }`}
        >
          Deposit
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 rounded-xl py-3 font-bold transition-colors ${
            activeTab === 'withdraw' ? 'bg-yellow-400 text-red-900' : 'bg-red-800/50 text-white'
          }`}
        >
          Withdraw
        </motion.button>
      </div>

      {activeTab === 'deposit' ? (
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl bg-red-800/50 p-6">
            <h3 className="text-lg font-bold text-yellow-400">Bank Details</h3>
            <div className="space-y-2">
              <InfoRow label="Bank" value={bankDetails.bank} copy={false} />
              <InfoRow label="Account Number" value={bankDetails.accountNumber} copy />
              <InfoRow label="Account Name" value={bankDetails.accountName} copy={false} />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-red-800/50 p-6">
            <h3 className="text-lg font-bold text-yellow-400">Submit Deposit</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border-2 border-yellow-400/30 bg-red-900 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-yellow-400"
            />
            <div className="rounded-xl border-2 border-dashed border-yellow-400/30 p-6 text-center">
              <IoCard className="mx-auto mb-2 h-12 w-12 text-yellow-400" />
              <p className="mb-2 text-sm text-gray-300">Upload Payment Proof</p>
              <input type="file" className="hidden" id="proof" />
              <label htmlFor="proof" className="cursor-pointer text-sm font-medium text-yellow-400">
                Choose File
              </label>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-yellow-500 to-yellow-400 py-4 font-bold text-red-900"
            >
              <IoSend className="h-5 w-5" />
              Submit Request
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl bg-red-800/50 p-6">
            <h3 className="text-lg font-bold text-yellow-400">Withdraw Funds</h3>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full rounded-xl border-2 border-yellow-400/30 bg-red-900 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-yellow-400"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-linear-to-r from-yellow-500 to-yellow-400 py-4 font-bold text-red-900"
            >
              Request Withdrawal
            </motion.button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-red-800/50 p-6">
        <h3 className="mb-4 text-lg font-bold text-yellow-400">Recent Transactions</h3>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserWallet

function InfoRow({ label, value, copy }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold">{value}</span>
        {copy && (
          <button className="text-yellow-400">
            <IoCopy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function TransactionItem({ transaction }) {
  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return '💰'
      case 'withdraw':
        return '💸'
      case 'entry_fee':
        return '🎮'
      case 'winnings':
        return '🏆'
      default:
        return '📝'
    }
  }

  const getColor = () => {
    return transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-red-900/50 p-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <div>
          <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
          <p className="text-xs text-gray-400">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${getColor()}`}>
          {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
        </p>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            transaction.status === 'approved' || transaction.status === 'completed'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  )
}
