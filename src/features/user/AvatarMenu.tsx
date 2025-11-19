import { useState } from 'react'
import { useUpdateAvatar } from './useUpdateAvatar'
import { useUser } from '../auth/useUser'
import SpinnerMini from '../../components/SpinnerMini'

export default function AvatarMenu({ avatarUrl }) {
  const [open, setOpen] = useState(false)
  const { updateAvatar, isUpdatingAvatar } = useUpdateAvatar()
  const { user } = useUser()
  const userId = user?.id

  const handleDicebear = () => {
    const random = Math.random().toString(36).substring(7)
    const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${random}`
    if (!userId) return

    updateAvatar({ id: userId, avatarFile: avatar })
    setOpen(false)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!userId) return
    updateAvatar({ id: userId, avatarFile: file })

    console.log(file)
  }

  if (isUpdatingAvatar) return <SpinnerMini />

  return (
    <div className="relative">
      <img
        src={avatarUrl}
        alt="avatar"
        className="h-20 w-20 cursor-pointer rounded-full"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute top-24 left-0 w-40 rounded-lg bg-slate-700 p-4 shadow-xl">
          <label className="block cursor-pointer">
            Upload Image
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>

          <button onClick={handleDicebear} className="mt-2 w-full rounded bg-slate-700 p-1">
            Use avatar
          </button>
        </div>
      )}
    </div>
  )
}
