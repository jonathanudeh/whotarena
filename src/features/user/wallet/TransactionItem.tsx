import SpinnerMini from '../../../components/SpinnerMini'
import TransactionList from './TransactionList'
import { useUserTransactionHistory } from './useUserTransactionHistory'

function TransactionItem() {
  const { transactions = [], isGettingTransactions } = useUserTransactionHistory()

  if (!transactions.length) return <p className="mx-auto">No Transaction history</p>

  return (
    <div className="bg-card-bg rounded-2xl p-6">
      <h3 className="mb-4 text-lg font-bold text-green-400">Recent Transactions</h3>
      {isGettingTransactions ? (
        <SpinnerMini />
      ) : (
        <ul className="no-scrollbar h-90 space-y-3 overflow-y-scroll">
          {transactions.map((transaction) => (
            <TransactionList key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TransactionItem
