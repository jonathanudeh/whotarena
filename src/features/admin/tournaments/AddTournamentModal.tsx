import { useForm, type FieldErrors } from 'react-hook-form'
import AdminFormRow from '../../../components/AdminFormRow'
import { useCreateTournament } from './useCreateTournament'
import type { AddTournamentModalProps, FormTournament } from '../../../types/tournament'

export default function AddTournamentModal({ onClose }: AddTournamentModalProps) {
  const { register, handleSubmit, reset, formState } = useForm<FormTournament>()
  const { createTournament, isCreating } = useCreateTournament()

  const { errors } = formState

  function onSubmitForm(data: FormTournament) {
    createTournament(
      { ...data, image: data.image[0] },
      {
        onSuccess: () => {
          reset()
          onClose()
        }
      }
    )
  }

  function onErrorForm(errors: FieldErrors<FormTournament>) {
    console.error(errors)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl md:max-w-2/3">
        <h2 className="text-center text-xl font-bold text-slate-200">Create New Tournament</h2>

        <form onSubmit={handleSubmit(onSubmitForm, onErrorForm)} className="space-y-3">
          <AdminFormRow label="Tournament Name" error={errors?.name?.message}>
            <input
              type="text"
              id="name"
              disabled={isCreating}
              {...register('name', { required: 'This field is required' })}
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              placeholder="Weekend Cashout"
            />
          </AdminFormRow>

          <div className="grid grid-cols-2 gap-4">
            <AdminFormRow label="Entry Fee (₦)" error={errors?.entryFee?.message}>
              <input
                type="number"
                id="entryFee"
                disabled={isCreating}
                {...register('entryFee', { required: 'This field is required' })}
                className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
                placeholder="200"
              />
            </AdminFormRow>

            <AdminFormRow label="Prize (₦)" error={errors?.prize?.message}>
              <input
                type="number"
                id="prize"
                disabled={isCreating}
                {...register('prize', { required: 'This field is required' })}
                className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
                placeholder="50,000"
              />
            </AdminFormRow>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminFormRow label="Max Players" error={errors?.maxPlayers?.message}>
              <input
                id="maxPlayers"
                disabled={isCreating}
                {...register('maxPlayers', { required: 'This field is required' })}
                className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
                placeholder="2500"
              />
            </AdminFormRow>

            <AdminFormRow label="Banner Image" error={errors?.image?.message}>
              <input
                type="file"
                id="image"
                disabled={isCreating}
                {...register('image', { required: 'This field is required' })}
                className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              />
            </AdminFormRow>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminFormRow label="Begins" error={errors?.startAt?.message}>
              <input
                type="date"
                id="startAt"
                disabled={isCreating}
                {...register('startAt', { required: 'This field is required' })}
                className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              />
            </AdminFormRow>

            <AdminFormRow label="Ends" error={errors?.endAt?.message}>
              <input
                type="date"
                id="endAt"
                disabled={isCreating}
                {...register('endAt', { required: 'This field is required' })}
                className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              />
            </AdminFormRow>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="rounded-lg border border-slate-500 px-4 py-2 text-white hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
