import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { joinOrCreateMatch as joinOrCreateMatchAPI } from '../../services/apiJoinOrCreateMatch'
import {
  createGameEntryTransaction,
  createGameRefundTransaction
} from '../../services/apiWalletTransaction'
import { useNavigate } from 'react-router-dom'

type JoinWithFeeVars = {
  roomId: number
  userId: string
  entryFee: number
}

/**
 * Hook that handles the full join flow with entry fee deduction:
 * 1. Deduct entry fee
 * 2. Join game
 * 3. Auto-refund if join fails
 * 4. Allow retry after deduction succeeds
 */
export function useJoinWithEntryFee() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<number | null>(null)
  const [canRetryJoin, setCanRetryJoin] = useState(false)

  /**
   * Step 1: Deduct entry fee
   */
  const deductEntryFee = async (userId: string, roomId: number, entryFee: number) => {
    try {
      const transaction = await createGameEntryTransaction({
        userId,
        roomId,
        entryFee
      })

      setTransactionId(transaction.id)
      setError(null)

      // Invalidate balance cache immediately
      queryClient.invalidateQueries({ queryKey: ['userBalance', userId] })

      return transaction
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to process entry fee. Please try again.'
      setError(errorMsg)
      toast.error(`${errorMsg}`)
      console.log({ errorMsg, err })
      throw err
    }
  }

  /**
   * Step 2: Join the game
   */
  const joinGame = async (roomId: number, userId: string) => {
    try {
      const mId = await joinOrCreateMatchAPI({ roomId, userId })
      setCanRetryJoin(false)
      console.log(mId)
      return mId
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to join game'
      console.log({ errorMsg, err })
      throw new Error(errorMsg)
    }
  }

  /**
   * Step 3: Auto-refund if join failed
   */
  const autoRefund = async (userId: string, entryFee: number) => {
    if (!transactionId) {
      console.warn('No transaction ID to refund')
      return
    }

    try {
      toast.loading('Refunding entry fee...')
      await createGameRefundTransaction({
        userId,
        originalTransactionId: transactionId,
        entryFee
      })

      // Invalidate balance cache to show refund immediately
      queryClient.invalidateQueries({ queryKey: ['userBalance', userId] })
      queryClient.invalidateQueries({ queryKey: ['transactionHistory', userId] })

      toast.dismiss()
      toast.success('✅ Entry fee refunded')

      // Reset state to allow retry
      setTransactionId(null)
      setCanRetryJoin(false)
    } catch (err) {
      toast.dismiss()
      const refundError = err instanceof Error ? err.message : 'Failed to process refund'
      toast.error(`Refund processing failed: ${refundError}. Please contact support.`)
      console.error('Refund error:', err)
    }
  }

  /**
   * Main function: Deduct fee → Join → Handle failure
   */
  const joinWithFee = async (vars: JoinWithFeeVars) => {
    const { roomId, userId, entryFee } = vars

    setIsJoining(true)
    setError(null)
    setCanRetryJoin(false)
    console.log('Joining room with fee: ', vars)

    try {
      // Step 1: Deduct the entry fee
      await deductEntryFee(userId, roomId, entryFee)

      // Step 2: Try to join the game
      try {
        const mId = await joinGame(roomId, userId)

        // Success! Navigate to game
        setIsJoining(false)
        navigate(`/game/${mId}`, { replace: true })
      } catch (joinErr) {
        // Join failed → auto-refund
        const joinErrorMsg = joinErr instanceof Error ? joinErr.message : 'Could not join game'

        console.log({ joinErr, joinErrorMsg })

        toast.error(`${joinErrorMsg}`)

        // Auto-refund
        await autoRefund(userId, entryFee)

        // Allow user to retry join
        setCanRetryJoin(true)
        setError(joinErrorMsg)
        setIsJoining(false)
      }
    } catch {
      // Deduction itself failed → no need to refund
      setIsJoining(false)
      setCanRetryJoin(false)
      console.log('Err')
    }
  }

  /**
   * Retry join after fee was deducted but join failed
   * Used when user wants to retry joining after refund
   */
  const retryJoin = async (roomId: number, userId: string, entryFee: number) => {
    setIsJoining(true)
    setError(null)

    try {
      // Deduct fee again (since user was refunded)
      await deductEntryFee(userId, roomId, entryFee)

      // Try to join
      const mId = await joinGame(roomId, userId)

      // Success!
      setIsJoining(false)
      navigate(`/game/${mId}`, { replace: true })
    } catch {
      // Retry join failed → auto-refund again
      await autoRefund(userId, entryFee)
      setCanRetryJoin(true)
      setIsJoining(false)
    }
  }

  return {
    joinWithFee,
    retryJoin,
    isJoining,
    error,
    canRetryJoin,
    transactionId
  }
}
