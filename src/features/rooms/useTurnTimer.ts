import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { chooseWhotShape, pickFromMarket } from '../../services/apiGameService'
import toast from 'react-hot-toast'
import type { ShapeType } from './ChooseShapeModal'
import type { GameState } from './types'

// interface GameState {
//   turn: string
//   awaitingShapeChoice?: string
//   turnEndTime?: string
//   awaitingShapeEndTime?: string
//   playerOrder: string[]
//   playerMeta?: Record<string, { type: 'human' | 'ai' }>
//   // other fields...
// }

const COUNTDOWN_SECONDS = 30

export function useTurnTimer(matchId: number, gameState: GameState, me: string) {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS)
  const [isShapeSelection, setIsShapeSelection] = useState(false)
  const timedOutTurnRef = useRef<string | null>(null)
  const previousTurn = useRef<string | null>(null)

  const handleAutoAdvance = useCallback(async () => {
    try {
      await pickFromMarket({ matchId, userId: me })
      toast.dismissAll()
      toast.error('Timed out - go market and advanced turn')
    } catch (err) {
      toast.dismissAll()
      toast.error('Failed to auto-advance turn')
      console.error(err)
    }
  }, [matchId, me])

  const handleAutoPickShape = useCallback(
    async (shape: string) => {
      try {
        await chooseWhotShape({ matchId, userId: me, shape: shape as ShapeType })
      } catch (err) {
        toast.dismissAll()
        toast.error('Failed to auto-pick shape')
        console.error(err)
      }
    },
    [matchId, me]
  )

  useLayoutEffect(() => {
    const currentPlayerMeta = gameState.playerMeta?.[gameState.turn]

    //  If AI is playing, do NOTHING
    if (currentPlayerMeta?.type === 'ai') {
      setTimeLeft(COUNTDOWN_SECONDS)
      timedOutTurnRef.current = null
      previousTurn.current = gameState.turn
      return
    }

    const isMyTurn = gameState.turn === me
    const isAwaitingMyShape = gameState.awaitingShapeChoice === me
    const active = isMyTurn || isAwaitingMyShape

    // Reset timer if turn changed
    if (previousTurn.current !== gameState.turn) {
      setTimeLeft(COUNTDOWN_SECONDS)
      timedOutTurnRef.current = null
      previousTurn.current = gameState.turn
    }

    if (!active) {
      setTimeLeft(COUNTDOWN_SECONDS)
      setIsShapeSelection(false)
      return
    }

    setIsShapeSelection(!!isAwaitingMyShape)
    const endTime = isAwaitingMyShape ? gameState.awaitingShapeEndTime : gameState.turnEndTime

    if (!endTime) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, (new Date(endTime).getTime() - Date.now()) / 1000)
      setTimeLeft(remaining)

      if (remaining <= 0 && timedOutTurnRef.current !== gameState.turn) {
        timedOutTurnRef.current = gameState.turn

        if (isAwaitingMyShape) {
          const shapes = ['circle', 'square', 'triangle', 'star', 'cross']
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
          handleAutoPickShape(randomShape)
        } else {
          handleAutoAdvance()
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [
    gameState.awaitingShapeChoice,
    gameState.awaitingShapeEndTime,
    gameState.playerMeta,
    gameState.turn,
    gameState.turnEndTime,
    handleAutoAdvance,
    handleAutoPickShape,
    me
  ])

  return { timeLeft, isShapeSelection }
}
