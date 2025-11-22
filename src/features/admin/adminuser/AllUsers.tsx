import { useState } from 'react'
import { useGetUsers } from './useGetAllUsers'
import { useGetUserStats } from './useGetUserStats'
import { useBanUser } from './useBanUser'
import { useUnbanUser } from './useUnbanUser'
import SpinnerMini from '../../../components/SpinnerMini'
import ConfirmModal from '../../../components/ConfirmModal'
import { formatDateOnly } from '../../../utils/helper'

function AllUsers() {
  const { getAllUsers = [], isGettingAllUsers } = useGetUsers()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modalAction, setModalAction] = useState<null | 'ban' | 'unban'>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const { getUserStats, isGettingUsersStat } = useGetUserStats(expandedId)
  const { balance, totalDeposits } = getUserStats || {}

  const { banUser, isBanningUSer } = useBanUser()
  const { unBanUser, isUnbanningUser } = useUnbanUser()
  const isBanOperation = isBanningUSer || isUnbanningUser

  if (isGettingAllUsers) return <SpinnerMini />

  return (
    <>
      <div className="w-full space-y-2">
        {/* HEADER */}
        <div className="grid grid-cols-[60px_1fr_1fr_100px_auto] px-2 py-2 text-xs font-semibold text-gray-400 uppercase">
          <p>Avatar</p>
          <p>Username</p>
          <p>Email</p>
          <p>Status</p>
          <p></p>
        </div>

        <div className="divide-y divide-gray-800">
          {getAllUsers.map((user) => {
            const {
              userId,
              ban_duration,
              avatar,
              username,
              email,
              created_at,
              gamesPlayed,
              gamesWon
            } = user
            const isOpen = expandedId === userId

            const status = ban_duration && new Date(ban_duration) > new Date() ? 'Banned' : 'Active'

            return (
              <div key={userId} className="py-2">
                {/* MAIN ROW */}
                <div className="grid grid-cols-[60px_1fr_1fr_100px_auto] items-center px-2 py-2">
                  <img
                    src={avatar || '/default.png'}
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  <p className="truncate">{username}</p>
                  <p className="truncate text-gray-400">{email}</p>
                  <p>{status}</p>

                  {/* Expand */}
                  <button onClick={() => setExpandedId(isOpen ? null : userId)}>
                    {isOpen ? '▲' : '▼'}
                  </button>
                </div>

                {/* EXPANDED */}
                {isOpen && (
                  <div className="space-y-2 rounded-lg bg-gray-900/40 p-4 text-sm">
                    <p>
                      <span className="text-gray-400">User ID:</span> {userId}
                    </p>
                    <p>
                      <span className="text-gray-400">Joined:</span> {formatDateOnly(created_at)}
                    </p>
                    <p>
                      <span className="text-gray-400">Games Played:</span> {gamesPlayed}
                    </p>
                    <p>
                      <span className="text-gray-400">Games Won:</span> {gamesWon}
                    </p>

                    {isGettingUsersStat ? (
                      <SpinnerMini />
                    ) : (
                      <>
                        <p>
                          <span className="text-gray-400">Balance:</span> ₦{balance}
                        </p>
                        <p>
                          <span className="text-gray-400">Total Deposits:</span> ₦{totalDeposits}
                        </p>
                      </>
                    )}

                    <div className="mt-3 flex gap-3">
                      {status === 'Active' ? (
                        <button
                          className="bg-btn-danger rounded px-3 py-1"
                          onClick={() => {
                            setSelectedUser(user)
                            setModalAction('ban')
                          }}
                        >
                          Ban User
                        </button>
                      ) : (
                        <button
                          className="bg-btn-primary rounded px-3 py-1"
                          onClick={() => {
                            setSelectedUser(user)
                            setModalAction('unban')
                          }}
                        >
                          Unban User
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {modalAction && (
        <ConfirmModal
          isOpen={!!modalAction}
          title={modalAction === 'ban' ? 'Ban this user?' : 'Unban this user?'}
          onConfirm={() => {
            if (modalAction === 'ban') {
              banUser(selectedUser.userId)
            } else {
              unBanUser(selectedUser.userId)
            }
            setModalAction(null)
          }}
          onClose={() => setModalAction(null)}
          disabled={isBanOperation}
        />
      )}
    </>
  )
}

export default AllUsers
