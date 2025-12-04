import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unbanUser as unbanUserApi } from '../../../services/apiAdminUsers'
import toast from 'react-hot-toast'

export function useUnbanUser() {
  const queryClient = useQueryClient()

  const { mutate: unBanUser, isPending: isUnbanningUser } = useMutation({
    mutationFn: unbanUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      toast.success('user has been unbanned')
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { unBanUser, isUnbanningUser }
}
