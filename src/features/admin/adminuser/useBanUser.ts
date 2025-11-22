import { useMutation, useQueryClient } from '@tanstack/react-query'
import { banUser as banUserApi } from '../../../services/apiAdminUsers'

export function useBanUser() {
  const queryClient = useQueryClient()

  const { mutate: banUser, isPending: isBanningUSer } = useMutation({
    mutationFn: banUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    }
  })

  return { banUser, isBanningUSer }
}
