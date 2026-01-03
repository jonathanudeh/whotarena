import { useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import { finalizeMatch } from '../../services/apiFinalizeMatch'

interface WinnerScreenProps {
  winnerId: string
  winnerName: string
  winnerAvatar?: string
  playerIds: string[]
  prizeAmount: number
  matchId: number
}

const isUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

export default function WinnerScreen({
  winnerId,
  winnerName,
  winnerAvatar,
  playerIds,
  prizeAmount,
  matchId
}: WinnerScreenProps) {
  const hasFinalized = useRef(false)

  useEffect(() => {
    if (hasFinalized.current || !matchId) return
    hasFinalized.current = true

    const humanWinnerId = isUUID(winnerId) ? winnerId : null
    const humanPlayerIds = playerIds.filter(isUUID)

    finalizeMatch({
      matchId,
      winnerId: humanWinnerId,
      prizeAmount,
      playerIds: humanPlayerIds
    }).catch(console.error)
  }, [winnerId, matchId, prizeAmount, playerIds])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Confetti width={window.innerWidth} height={window.innerHeight} />

      <div className="w-[90%] max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        {winnerAvatar ? (
          <img
            src={winnerAvatar || undefined}
            alt="Winner Avatar"
            className="mx-auto mb-4 h-24 w-24 rounded-full"
          />
        ) : (
          <div className="avatar-placeholder" />
        )}

        <h1 className="mb-2 text-3xl font-bold text-green-600">🎉 {winnerName} Wins! 🎉</h1>

        <p className="mb-4 text-gray-700">Congratulations Champion of WhotArena 🔥</p>

        <p className="text-sm text-gray-500">Redirecting to lobby...</p>
      </div>
    </div>
  )
}

//

//

/*
interface WinnerScreenProps {
  winnerId: string
  winnerName: string
  winnerAvatar: string | undefined
  playerIds: string[]
  prizeAmount: number
  matchId: number
}

export default function WinnerScreen({
  winnerId,
  winnerName,
  winnerAvatar,
  playerIds,
  prizeAmount,
  matchId
}: WinnerScreenProps) {
  const { updateMatchResults, isUpdatingMatchResults } = useUpdateMatchResults(() =>
    awardGamePrize({ winnerId, matchId, prizeAmount })
  )
  const { awardGamePrize, isAwardingGamePrize } = useGamePrize()
  const isLoading = isUpdatingMatchResults || isAwardingGamePrize
  const hasFinalized = useRef(false)

  const isHumanWinner = /^[0-9a-f-]{36}$/i.test(winnerId)

  useEffect(() => {
    if (hasFinalized.current || !winnerId || !matchId) {
      return
    }

    hasFinalized.current = true

    if (!isHumanWinner) {
      return
    }

    updateMatchResults({ winnerId, players: playerIds, matchId })
  }, [winnerId, matchId, prizeAmount, playerIds, isHumanWinner, updateMatchResults, awardGamePrize])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Confetti width={window.innerWidth} height={window.innerHeight} />

      <div className="w-[90%] max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        {winnerAvatar ? (
          <img
            src={winnerAvatar || undefined}
            alt="Winner Avatar"
            className="mx-auto mb-4 h-24 w-24 rounded-full"
          />
        ) : (
          <div className="avatar-placeholder" />
        )}

        <h1 className="mb-2 text-3xl font-bold text-green-600">🎉 {winnerName} Wins! 🎉</h1>

        <p className="mb-4 text-gray-700">Congratulations Champion of WhotArena 🔥</p>

        {isLoading && <p className="text-sm text-gray-500">Redirecting to lobby...</p>}
      </div>
    </div>
  )
}
*/
