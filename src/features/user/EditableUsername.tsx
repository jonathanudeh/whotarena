import { useState, useRef } from 'react'
import { HiPencil } from 'react-icons/hi'
import { useMutation } from '@tanstack/react-query'
import { useUpdateUsername } from './useUpdateUsername'
import { useUser } from '../auth/useUser'
import SpinnerMini from '../../components/SpinnerMini'
// import supabase from "../supabase";

export default function EditableUsername({ initialName }) {
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(initialName)
  const { updateUsername, isUpdatingUsername } = useUpdateUsername()
  const { user } = useUser()
  const userId = user?.id

  const inputRef = useRef()

  const handleBlur = () => {
    // updateName.mutate(username)
    setEditing(false)
    console.log({ userId, username })

    if (!userId) return
    updateUsername({ id: userId, username })
  }

  if (isUpdatingUsername) return <SpinnerMini />

  // const updateName = useMutation({
  // mutationFn: async (newName) => {
  //   const { error } = await supabase
  //     .from("profiles")
  //     .update({ username: newName })
  //     .eq("id", supabase.auth.getUser().id);
  //   if (error) throw error;
  // },
  // onSuccess: () => setEditing(false),
  // })

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <input
          ref={inputRef}
          autoFocus
          className="border-x border-b border-gray-400 bg-transparent text-center outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={handleBlur}
          // onKeyDown={(e) => {
          //   if (e.key === 'Enter') inputRef.current.blur()
          // }}
        />
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
  )
}
