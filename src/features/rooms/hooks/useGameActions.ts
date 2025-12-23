import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { playMove, resolveStackedTwo, chooseWhotShape } from '../../../services/apiGameService'
import type { Card, GameState, ShapeType } from '../types'

interface UseGameActionsProps {
  matchId: number
  userId: string
  gameState: GameState | null
}

interface UseGameActionsReturn {
  handlePlayCard: (card: Card) => Promise<void>
  handleChooseShape: (shape: ShapeType) => Promise<void>
}

export function useGameActions({
  matchId,
  userId,
  gameState
}: UseGameActionsProps): UseGameActionsReturn {
  const handlePlayCard = useCallback(
    async (card: Card) => {
      if (!matchId || !userId || !gameState) return

      // Validate turn
      if (gameState.turn !== userId) {
        toast.error("It's not your turn")
        return
      }

      // Handle stacked PICK TWO
      if (gameState.stackedTwo && card.num !== 2) {
        try {
          await resolveStackedTwo({ matchId, userId })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to resolve pick two'
          toast.error(message)
        }
        return
      }

      // Validate required shape (WHOT mode)
      const requiredShape = gameState.requiredShape
      if (requiredShape) {
        if (card.shape !== requiredShape && card.num !== 20) {
          toast.error(`You must play a ${requiredShape} card or WHOT`)
          return
        }
      }

      // Play the card
      try {
        await playMove({ matchId, userId, card })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to play card'
        toast.error(message)
      }
    },
    [matchId, userId, gameState]
  )

  const handleChooseShape = useCallback(
    async (shape: ShapeType) => {
      if (!matchId || !userId) return

      try {
        await chooseWhotShape({ matchId, userId, shape })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to choose shape'
        toast.error(message)
      }
    },
    [matchId, userId]
  )

  return {
    handlePlayCard,
    handleChooseShape
  }
}
