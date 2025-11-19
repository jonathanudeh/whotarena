import { useMutation } from '@tanstack/react-query'
import { signUp as signUpApi } from '../../services/apiAuth'
import toast from 'react-hot-toast'

export function useSignUp() {
  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      toast.success('Acount created successfully! \n Confirm your email')
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { isSigningUp, signUp }
}
