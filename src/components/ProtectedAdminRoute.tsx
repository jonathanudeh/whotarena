import { useNavigate } from 'react-router-dom'
import { useUser } from '../features/auth/useUser'
import SpinnerMini from './SpinnerMini'
import { useEffect } from 'react'
import { useUserProfile } from '../features/user/useUserProfile'

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { isFetchingUser, isAuthenticated } = useUser()
  const { userProfile: { isAdmin } = {}, isLoadingUserProfile } = useUserProfile()

  useEffect(() => {
    // if not authenticated and not loading then log in
    if (!isAuthenticated && !isFetchingUser) {
      navigate('/login', { replace: true })
    }

    // If authenticated, but NOT an admin and not loading profile, redirect to a wrong url that is a typo of admin -> admiin
    if (isAuthenticated && !isLoadingUserProfile && !isAdmin) {
      navigate('/admiin', { replace: true })
    }
  }, [isAuthenticated, isFetchingUser, navigate, isAdmin, isLoadingUserProfile])

  if (isFetchingUser && isLoadingUserProfile)
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerMini />
      </div>
    )

  if (isAuthenticated && isAdmin) return children
}

export default ProtectedAdminRoute
