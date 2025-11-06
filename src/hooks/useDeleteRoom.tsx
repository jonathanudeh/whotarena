import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRoom } from '../services/apiRooms'
import toast from 'react-hot-toast'

export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      toast.success('Room deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
}
