import { useLayoutEffect, useRef, useState } from 'react'
import { chooseWhotShape, pickFromMarket } from '../../services/apiGameService'
import toast from 'react-hot-toast'
import type { ShapeType } from './ChooseShapeModal'

interface GameState {
  turn: string
  awaitingShapeChoice?: string
  turnEndTime?: string
  awaitingShapeEndTime?: string
  playerOrder: string[]
  // other fields...
}

export function useTurnTimer(matchId: number, gameState: GameState, me: string) {
  const [timeLeft, setTimeLeft] = useState(20)
  const [isShapeSelection, setIsShapeSelection] = useState(false)
  const timedOutTurnRef = useRef<string | null>(null)
  const previousTurn = useRef<string | null>(null)

  useLayoutEffect(() => {
    const isMyTurn = gameState.turn === me
    const isAwaitingMyShape = gameState.awaitingShapeChoice === me
    const active = isMyTurn || isAwaitingMyShape

    // Reset timer if turn changed
    if (previousTurn.current !== gameState.turn) {
      setTimeLeft(20)
      timedOutTurnRef.current = null
      previousTurn.current = gameState.turn
    }

    if (!active) {
      setTimeLeft(20)
      setIsShapeSelection(false)
      //   hasTimedOut.current = false
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
  }, [matchId, gameState, me])

  const handleAutoAdvance = async () => {
    try {
      await pickFromMarket({ matchId, userId: me })
      toast.error('Turn timed out - picked from market and advanced turn')
    } catch (err) {
      toast.error('Failed to auto-advance turn')
      console.error(err)
    }
  }

  const handleAutoPickShape = async (shape: string) => {
    try {
      await chooseWhotShape({ matchId, userId: me, shape: shape as ShapeType })
    } catch (err) {
      toast.error('Failed to auto-pick shape')
      console.error(err)
    }
  }

  return { timeLeft, isShapeSelection }
}
