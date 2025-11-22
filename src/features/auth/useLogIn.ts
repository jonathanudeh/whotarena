import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logIn as logInApi } from '../../services/apiAuth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function useLogIn() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: logIn, isPending: IsLoggingIn } = useMutation({
    mutationFn: logInApi,
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user)
      navigate('/lobby', { replace: true })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { logIn, IsLoggingIn }
}
