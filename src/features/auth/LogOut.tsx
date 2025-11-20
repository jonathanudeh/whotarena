import { LuLogOut } from 'react-icons/lu'
import Button from '../../components/Button'
import { useLogOut } from './useLogOut'

interface LogOutProps {
  isProfile?: boolean
}

function LogOut({ isProfile }: LogOutProps) {
  const { logOut, isLoggingOut } = useLogOut()

  if (isProfile)
    return (
      <Button variation="logOut" size="large" disabled={isLoggingOut} onClick={logOut}>
        <LuLogOut size={20} />
        Logout
      </Button>
    )

  return (
    <Button variation="danger" disabled={isLoggingOut} onClick={logOut}>
      <LuLogOut size={20} />
      Logout
    </Button>
  )
}

export default LogOut
