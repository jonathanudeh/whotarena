import SpinnerMini from '../../../components/SpinnerMini'
import { formatCurrency } from '../../../utils/helper'
import { useAvailableBalance } from './useAvailableBalance'

function AvailableBalance() {
  const { availableBalance, isLoadingBalance } = useAvailableBalance()

  return (
    <div className="bg-card-bg text-main-text rounded-3xl p-6 text-center">
      <p className="mb-2 text-sm font-medium">Available Balance</p>
      {isLoadingBalance ? (
        <SpinnerMini />
      ) : (
        <p className="text-5xl font-black">{formatCurrency(availableBalance ?? 0)}</p>
      )}
    </div>
  )
}

export default AvailableBalance
