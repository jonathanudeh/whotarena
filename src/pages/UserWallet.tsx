import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoArrowBack, IoCard, IoCopy, IoSend } from 'react-icons/io5'
import { formatCurrency } from '../utils/helper'

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
      <div className="bg-card-bg text-main-text rounded-3xl p-6 text-center">
        <p className="mb-2 text-sm font-medium">Available Balance</p>
        <p className="text-5xl font-black">{formatCurrency(2205)}</p>
      </div>

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

      {activeTab === 'deposit' ? (
        <div className="space-y-4">
          <div className="bg-card-bg space-y-4 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-400">Bank Details</h3>
            <div className="space-y-2">
              <InfoRow label="Bank" value={bankDetails.bank} copy={false} />
              <InfoRow label="Account Number" value={bankDetails.accountNumber} copy />
              <InfoRow label="Account Name" value={bankDetails.accountName} copy={false} />
            </div>
          </div>

          <div className="bg-card-bg space-y-4 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-400">Submit Deposit</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background border-border/30 focus:border-border w-full rounded-xl border-2 px-4 py-3 text-white placeholder-gray-400 outline-none"
            />
            <div className="rounded-xl border-2 border-dashed border-yellow-400/30 p-6 text-center">
              <IoCard className="mx-auto mb-2 h-12 w-12 text-green-400" />
              <p className="mb-2 text-sm text-gray-300">Upload Payment Proof</p>
              <input type="file" className="hidden" id="proof" />
              <label htmlFor="proof" className="cursor-pointer text-sm font-medium text-green-400">
                Choose File
              </label>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-main-text flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-green-700 to-green-800 py-4 font-bold"
            >
              <IoSend className="h-5 w-5" />
              Submit Request
            </motion.button>
          </div>
        </div>
      ) : (
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
      )}

      <div className="bg-card-bg rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-bold text-green-400">Recent Transactions</h3>
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
          <button className="text-green-400">
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
    <div className="bg-background flex items-center justify-between rounded-xl p-3">
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
