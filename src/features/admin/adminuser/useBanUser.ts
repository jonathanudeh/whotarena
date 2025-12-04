import { useMutation, useQueryClient } from '@tanstack/react-query'
import { banUser as banUserApi } from '../../../services/apiAdminUsers'
import toast from 'react-hot-toast'

export function useBanUser() {
  const queryClient = useQueryClient()

  const { mutate: banUser, isPending: isBanningUSer } = useMutation({
    mutationFn: banUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      toast.success('user has been banned')
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { banUser, isBanningUSer }
}
