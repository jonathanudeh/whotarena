import { useNavigate } from 'react-router-dom'
import { useUser } from '../features/auth/useUser'
import SpinnerMini from './SpinnerMini'
import { useEffect } from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { isFetchingUser, isAuthenticated } = useUser()

  useEffect(() => {
    if (!isAuthenticated && !isFetchingUser) navigate('/login', { replace: true })
  }, [isAuthenticated, isFetchingUser, navigate])

  if (isFetchingUser)
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerMini />
      </div>
    )

  if (isAuthenticated) return children
}

export default ProtectedRoute
