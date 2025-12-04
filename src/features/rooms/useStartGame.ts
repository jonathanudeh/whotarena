import { useMutation } from '@tanstack/react-query'
import { startGame as startGameApi } from '../../services/apiGameService'
import toast from 'react-hot-toast'

export function useStartGame() {
  const { mutate: startGame, isPending: isStarting } = useMutation({
    mutationFn: async (matchId: number) => {
      const res = await startGameApi({ matchId, cardCountPerPlayer: 5 })
      return res
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Could not start game')
      console.error(err)
    }
  })

  return {
    startGame,
    isStarting
    // data: mutation.data as { success: boolean; match?: any; gameState?: GameState } | undefined
  }
}
