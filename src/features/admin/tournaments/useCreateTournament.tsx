import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createTournament as createTournamentApi } from '../../../services/apiTournament'

export function useCreateTournament() {
  const queryClient = useQueryClient()

  const { mutate: createTournament, isPending: isCreating } = useMutation({
    mutationFn: createTournamentApi,
    onSuccess: () => {
      toast.success('Tournament created successfully')
      queryClient.invalidateQueries({
        queryKey: ['tournaments']
      })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { createTournament, isCreating }
}
