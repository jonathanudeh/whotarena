import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteTournament as deleteTournamentApi } from '../services/apiTournament'

export function useDeleteTournament() {
  const queryClient = useQueryClient()

  const { mutate: deleteTournament, isPending: isDeleting } = useMutation({
    mutationFn: deleteTournamentApi,
    onSuccess: () => {
      toast.success('Tournament deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { deleteTournament, isDeleting }
}
