import { LuLogOut } from 'react-icons/lu'
import Button from '../../components/Button'
import { useLogOut } from './useLogOut'

function LogOut() {
  const { logOut, isLoggingOut } = useLogOut()

  return (
    <Button variation="danger" disabled={isLoggingOut} onClick={logOut}>
      <LuLogOut size={20} />
      Logout
    </Button>
  )
}

export default LogOut
