import { useMutation } from '@tanstack/react-query'
import { joinOrCreateMatch as joinOrCreateMatchAPi } from '../../services/apiJoinOrCreateMatch'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

type JoinVars = {
  roomId: number
  userId: string
}

export function useJoinOrCreateMatch() {
  const navigate = useNavigate()

  const { mutate: joinOrCreateMatch, isPending: isJoining } = useMutation<number, Error, JoinVars>({
    mutationFn: (vars) => joinOrCreateMatchAPi(vars),

    onSuccess: (matchId) => {
      // const { roomId } = variables
      navigate(`/game/${matchId}`, { replace: true })
    },

    onError: (err) => {
      toast.error(err.message)
    }
  })

  return { joinOrCreateMatch, isJoining }
}
