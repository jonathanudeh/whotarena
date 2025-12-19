import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGamePrizeTransaction } from '../../services/apiWalletTransaction'
import toast from 'react-hot-toast'

export function useGamePrize() {
  const queryClient = useQueryClient()

  const { mutate: awardGamePrize, isPending: isAwardingGamePrize } = useMutation({
    mutationFn: ({
      winnerId,
      matchId,
      prizeAmount
    }: {
      winnerId: string
      matchId: number
      prizeAmount: number
    }) => createGamePrizeTransaction({ winnerId, matchId, prizeAmount }),
    onSuccess: (_, { winnerId }) => {
      console.log('Prize awarded successfully for winner:', winnerId)
      toast.success('Prize awarded successfully!')
      queryClient.invalidateQueries({ queryKey: ['userBalance', winnerId] })
    },
    onError: (err) => {
      console.error('Failed to award prize:', err)
      toast.error(`Failed to award prize: ${err.message}`)
    }
  })

  return {
    awardGamePrize,
    isAwardingGamePrize
  }
}
