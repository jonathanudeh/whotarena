import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unbanUser as unbanUserApi } from '../../../services/apiAdminUsers'

export function useUnbanUser() {
  const queryClient = useQueryClient()

  const { mutate: unBanUser, isPending: isUnbanningUser } = useMutation({
    mutationFn: unbanUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    }
  })

  return { unBanUser, isUnbanningUser }
}
