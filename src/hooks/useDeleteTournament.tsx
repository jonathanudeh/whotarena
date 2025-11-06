import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteTournament } from '../services/apiTournament'

export function useDeleteTournament() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: () => {
      toast.success('Tournament deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
}
