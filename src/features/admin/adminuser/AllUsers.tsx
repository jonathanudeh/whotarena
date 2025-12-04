import { useState } from 'react'
import { useGetUsers } from './useGetAllUsers'
import { useGetUserStats } from './useGetUserStats'
import SpinnerMini from '../../../components/SpinnerMini'
import { formatCurrency, formatDateOnly } from '../../../utils/helper'

function AllUsers() {
  const { getAllUsers = [], isGettingAllUsers } = useGetUsers()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { getUserStats, isGettingUsersStat } = useGetUserStats(expandedId)
  const balance = getUserStats || 0

  if (isGettingAllUsers) return <SpinnerMini />

  return (
    <div className="w-full space-y-2">
      {/* HEADER */}
      <div className="grid grid-cols-[50px_60px_1fr_1fr_50px] px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase">
        <p>#</p>
        <p>Avatar</p>
        <p>Username</p>
        <p>Email</p>
        <p></p>
      </div>

      <div className="divide-y divide-gray-800">
        {getAllUsers.map((user, index) => {
          const { userId, avatar, username, email, created_at, gamesPlayed, gamesWon } = user
          const isOpen = expandedId === userId

          return (
            <div key={userId} className="py-1">
              {/* MAIN ROW */}
              <div
                className={`grid cursor-pointer grid-cols-[50px_60px_1fr_1fr_50px] items-center rounded-md px-3 py-2 transition ${isOpen ? 'bg-gray-900/50' : 'hover:bg-gray-800/40'}`}
                onClick={() => setExpandedId(isOpen ? null : userId)}
              >
                <p className="text-sm text-gray-400">{index + 1}</p>

                <img src={avatar || '/default.png'} className="h-8 w-8 rounded-full object-cover" />

                <p className="truncate">{username}</p>
                <p className="truncate text-gray-400">{email}</p>

                <div className="text-sm text-gray-400">{isOpen ? '▲' : '▼'}</div>
              </div>

              {/* EXPANDED CARD */}
              {isOpen && (
                <div className="border-border bg-card-bg animate-fadeIn mt-2 rounded-lg border p-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <p>
                      <span className="text-gray-400">User ID:</span> {userId}
                    </p>

                    <p>
                      <span className="text-gray-400">Email:</span> {email}
                    </p>

                    <p>
                      <span className="text-gray-400">Joined:</span> {formatDateOnly(created_at)}
                    </p>

                    <p>
                      <span className="text-gray-400">Balance:</span>{' '}
                      {isGettingUsersStat ? <SpinnerMini /> : formatCurrency(balance)}
                    </p>

                    <p>
                      <span className="text-gray-400">Games Played:</span> {gamesPlayed}
                    </p>

                    <p>
                      <span className="text-gray-400">Games Won:</span> {gamesWon}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllUsers
