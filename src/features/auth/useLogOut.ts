import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logOut as logOutApi } from '../../services/apiAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function useLogOut() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: logOut, isPending: isLoggingOut } = useMutation({
    mutationFn: logOutApi,
    onSuccess() {
      queryClient.invalidateQueries()
      navigate('/login', { replace: true })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { logOut, isLoggingOut }
}
