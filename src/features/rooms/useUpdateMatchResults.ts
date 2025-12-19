import { useMutation } from '@tanstack/react-query'
import { updateMatchResults as updateMatchResultsAPi } from '../../services/apiGameService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function useUpdateMatchResults(onSuccessCallback?: () => void) {
  const navigate = useNavigate()

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
      console.log('Match results updated successfully')
      onSuccessCallback?.()
      // setTimeout(() => {
      //   navigate('/lobby', { replace: true })
      // }, 5000)
    },
    onError: (err) => {
      console.error('Failed to update match results:', err)
      toast.error(err.message)
    }
  })

  return { updateMatchResults, isUpdatingMatchResults }
}
