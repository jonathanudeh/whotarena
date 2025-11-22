import type { TransactionListProps } from '../../../types/wallet'
import { formatTransactionDate } from '../../../utils/helper'

function TransactionList({ transaction }: TransactionListProps) {
  const { type, created_at: date, amount, status } = transaction

  const getIcon = () => {
    switch (type) {
      case 'deposit':
        return '💰'
      case 'withdraw':
        return '💸'
      case 'entryFee':
        return '🎮'
      case 'winnings':
        return '🏆'
      default:
        return '📝'
    }
  }

  const getColor = () => {
    return amount > 0 ? 'text-green-400' : 'text-red-400'
  }

  return (
    <li className="bg-background flex items-center justify-between rounded-xl p-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <div>
          <p className="font-medium capitalize">{type}</p>
          <p className="text-xs text-gray-400">{formatTransactionDate(date)}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold ${getColor()}`}>
          {amount > 0 ? '+' : ''}₦{Math.abs(amount).toLocaleString()}
        </p>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            status === 'approved' || status === 'completed'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {status}
        </span>
      </div>
    </li>
  )
}

export default TransactionList
