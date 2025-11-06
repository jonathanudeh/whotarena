import { useForm } from 'react-hook-form'
import AdminFormRow from '../../components/AdminFormRow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRoom } from '../../services/apiRooms'
import toast from 'react-hot-toast'

interface AddRoomFormModalProps {
  onClose: () => void
}

export default function AddRoomFormModal({ onClose }: AddRoomFormModalProps) {
  const { register, handleSubmit, reset, formState } = useForm()

  const { errors } = formState

  const queryClient = useQueryClient()

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      toast.success('Room created successfully')
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
      reset()
      onClose()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  function onSubmitForm(data) {
    // console.log(data)
    mutate(data)
  }

  function onErrorForm(errors) {
    console.error(errors)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl md:max-w-2/3">
        <h2 className="text-center text-xl font-bold text-white">Create New Room</h2>

        <form onSubmit={handleSubmit(onSubmitForm, onErrorForm)} className="space-y-4">
          <AdminFormRow label="Room name" error={errors?.name?.message}>
            <input
              type="text"
              id="name"
              disabled={isCreating}
              {...register('name', {
                required: 'This field is required'
              })}
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              placeholder="High Stakes Arena"
            />
          </AdminFormRow>

          <AdminFormRow label="Entry Fee (₦)" error={errors?.entryFee?.message}>
            <input
              type="number"
              id="entryFee"
              disabled={isCreating}
              {...register('entryFee', {
                required: 'This field is required'
              })}
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              placeholder="200"
            />
          </AdminFormRow>

          <AdminFormRow label="Prize Pool (₦)" error={errors?.prize?.message}>
            <input
              type="number"
              id="prize"
              disabled={isCreating}
              {...register('prize', {
                required: 'This field is required'
              })}
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              placeholder="500"
            />
          </AdminFormRow>

          <AdminFormRow label="Max Players" error={errors?.maxPlayers?.message}>
            <select
              {...register('maxPlayers', {
                required: 'This field is required'
              })}
              disabled={isCreating}
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
            >
              <option value="2">2 Players</option>
              <option value="3">3 Players</option>
              <option value="4">4 Players</option>
            </select>
          </AdminFormRow>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="rounded-lg border-[0.8px] border-slate-500 px-4 py-2 text-white hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
