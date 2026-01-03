import { useMutation } from '@tanstack/react-query'
import { updateMatchResults as updateMatchResultsAPi } from '../../services/apiGameService'
import toast from 'react-hot-toast'

export function useUpdateMatchResults(onSuccessCallback?: () => void) {
  const { mutate: updateMatchResults, isPending: isUpdatingMatchResults } = useMutation({
    mutationFn: ({
      winnerId,
      players,
      matchId
    }: {
      winnerId: string
      players: string[]
      matchId: number
    }) => updateMatchResultsAPi(winnerId, players, matchId),
    onSuccess: () => {
      onSuccessCallback?.()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { updateMatchResults, isUpdatingMatchResults }
}
