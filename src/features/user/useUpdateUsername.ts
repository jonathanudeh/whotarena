import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCurrentUserUsername } from '../../services/apiUserProfile'
import toast from 'react-hot-toast'

export function useUpdateUsername() {
  const queryClient = useQueryClient()

  const { mutate: updateUsername, isPending: isUpdatingUsername } = useMutation({
    mutationFn: updateCurrentUserUsername,
    onSuccess: () => {
      toast.success('Your username has been updated.')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { updateUsername, isUpdatingUsername }
}
