import SpinnerMini from '../../../components/SpinnerMini'
import { useGetWalletAccount } from '../../../hooks/useGetWalletAccount'
import DepositProof from './DepositProof'
import InfoRow from './InfoRow'

function DepositTab() {
  const { getWalletAccount = [], isGettingAccount } = useGetWalletAccount()
  const { bank, accountNumber, accountName } = getWalletAccount[0] || {}

  return (
    <div className="space-y-4">
      <div className="bg-card-bg space-y-4 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-green-400">Bank Details</h3>
        {isGettingAccount ? (
          <SpinnerMini />
        ) : (
          <div className="space-y-2">
            <InfoRow label="Bank" value={bank} copy={false} />
            <InfoRow label="Account Number" value={accountNumber} copy />
            <InfoRow label="Account Name" value={accountName} copy={false} />
          </div>
        )}
      </div>

      <DepositProof />
    </div>
  )
}

export default DepositTab
