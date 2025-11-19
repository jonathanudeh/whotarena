import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCurrentUserAvatar } from '../../services/apiUserProfile'
import toast from 'react-hot-toast'

export function useUpdateAvatar() {
  const queryClient = useQueryClient()

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useMutation({
    mutationFn: updateCurrentUserAvatar,
    onSuccess: (data) => {
      console.log(data)
      toast.success('Your avatar has been updated.')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { updateAvatar, isUpdatingAvatar }
}
