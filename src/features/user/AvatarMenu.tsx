import { useState } from 'react'
import { useUpdateAvatar } from './useUpdateAvatar'
import { useUser } from '../auth/useUser'
import SpinnerMini from '../../components/SpinnerMini'
import { useUserProfile } from './useUserProfile'

export default function AvatarMenu() {
  const [open, setOpen] = useState(false)
  const { updateAvatar, isUpdatingAvatar } = useUpdateAvatar()
  const { user } = useUser()
  const userId = user?.id
  const { userProfile = {}, isLoadingUserProfile } = useUserProfile()
  const { avatar } = userProfile

  const handleDicebear = () => {
    const random = Math.random().toString(36).substring(7)
    const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${random}`
    if (!userId) return

    updateAvatar({ id: userId, avatarFile: avatar })
    setOpen(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false)
    const file = e.target.files?.[0]
    if (!file) return

    if (!userId) return
    updateAvatar({ id: userId, avatarFile: file })
  }

  return (
    <div className="bg-avatar-bg border-avatar-border relative mx-auto mb-4 h-24 w-24 rounded-full border-4">
      {isLoadingUserProfile || isUpdatingAvatar ? (
        <div className="flex h-24 w-24 items-center justify-center">
          <SpinnerMini />
        </div>
      ) : (
        <img
          src={avatar}
          alt="avatar"
          className="h-full w-full cursor-pointer rounded-full object-cover"
          onClick={() => setOpen(!open)}
        />
      )}
      {open && (
        <div className="bg-background border-border/50 absolute top-24 left-0 w-40 space-y-3 rounded-lg border p-4 shadow-xl">
          <label className="hover:bg-card-bg border-border/30 block w-full cursor-pointer rounded border p-2">
            Upload Image
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>

          <button
            onClick={handleDicebear}
            className="hover:bg-card-bg border-border/30 block w-full cursor-pointer rounded border p-2"
          >
            Use avatar
          </button>
        </div>
      )}
    </div>
  )
}
