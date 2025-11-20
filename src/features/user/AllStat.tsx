import SpinnerMini from '../../components/SpinnerMini'
import { formatCurrency } from '../../utils/helper'
import StatCard from './StatCard'
import { useUserProfile } from './useUserProfile'

function AllStat() {
  const { userProfile = {}, isLoadingUserProfile } = useUserProfile()
  const { gamesPlayed, gamesWon, rank, totalEarnings } = userProfile

  if (isLoadingUserProfile) return <SpinnerMini />

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Games Played" value={gamesPlayed} />
      <StatCard label="Games Won" value={gamesWon} />
      <StatCard label="Rank" value={`${rank || '0 ranks'}`} />
      <StatCard label="Total Earnings" value={formatCurrency(totalEarnings)} />
    </div>
  )
}

export default AllStat
