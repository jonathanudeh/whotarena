import { useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import { useUpdateMatchResults } from './useUpdateMatchResults'
import { useGamePrize } from './useGamePrize'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const hasFinalized = useRef(false)

  const isHumanWinner = /^[0-9a-f-]{36}$/i.test(winnerId)

  useEffect(() => {
    if (hasFinalized.current || !winnerId || !matchId) {
      console.log('WinnerScreen useEffect skipped:', {
        hasFinalized: hasFinalized.current,
        winnerId,
        matchId,
        prizeAmount
      })
      return
    }

    hasFinalized.current = true
    console.log('WinnerScreen finalizing:', { winnerId, matchId, prizeAmount, playerIds })

    if (!isHumanWinner) {
      return
    }

    updateMatchResults({ winnerId, players: playerIds, matchId })
  }, [winnerId, matchId, prizeAmount, playerIds, isHumanWinner, updateMatchResults, awardGamePrize])

  // Auto-return to lobby
  useEffect(() => {
    console.log('Redirect useEffect, isLoading:', isLoading)
    // if (isLoading) return

    console.log('Setting redirect timeout')
    const t = setTimeout(() => {
      console.log('Redirecting to lobby')
      navigate('/lobby', { replace: true })
    }, 5000)

    return () => clearTimeout(t)
  }, [isLoading, navigate])

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
