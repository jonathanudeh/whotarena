import { useState, useRef, useEffect } from 'react'
import { HiPencil } from 'react-icons/hi'
import { useUpdateUsername } from './useUpdateUsername'
import { useUser } from '../auth/useUser'
import SpinnerMini from '../../components/SpinnerMini'
import { useUserProfile } from './useUserProfile'

export default function EditableUsername() {
  const { userProfile = {}, isLoadingUserProfile } = useUserProfile()
  const { username: initialName } = userProfile

  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(initialName)
  const { updateUsername, isUpdatingUsername } = useUpdateUsername()
  const { user } = useUser()
  const userId = user?.id
  const email = user?.email

  const inputRef = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    const trimmedUsername = username.replaceAll(' ', '')
    console.log({ userId, trimmedUsername })

    // Check if the username is empty or the same as the initial name
    if (!trimmedUsername || trimmedUsername === initialName) {
      // Close editing without submitting
      setEditing(false)
      setUsername(initialName)
      return
    }

    if (!userId) return
    updateUsername(
      { id: userId, username: trimmedUsername },
      {
        onSettled: () => setEditing(false)
      }
    )
  }

  useEffect(() => {
    if (initialName && !editing && initialName !== username) {
      setUsername(initialName)
    }
  }, [initialName, username, editing])

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {editing ? (
        <input
          ref={inputRef}
          autoFocus
          className="border-x border-b border-gray-400 bg-transparent text-center outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <div className="p flex items-center gap-2">
            {isUpdatingUsername || isLoadingUserProfile ? (
              <SpinnerMini />
            ) : (
              <>
                <span className="text-lg font-semibold">{username}</span>
                <HiPencil
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setEditing(true)}
                />
              </>
            )}
          </div>
        </>
      )}

      <p className="font-medium text-slate-200/50">{email}</p>
    </div>
  )
}
