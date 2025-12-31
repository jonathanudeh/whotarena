import AvailableBalance from './AvailableBalance'
import { useState } from 'react'
import DepositTab from './DepositTab'
import ActiveTab, { type TabType } from './ActiveTab'
import WithdrawTab from './WithdrawTab'
import TransactionItem from './TransactionItem'

function WalletLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('deposit')

  return (
    <div className="space-y-6 px-4">
      <AvailableBalance />

      <ActiveTab setActiveTab={setActiveTab} activeTab={activeTab} />

      {activeTab === 'deposit' ? <DepositTab /> : <WithdrawTab />}

      <TransactionItem />
    </div>
  )
}

export default WalletLayout
