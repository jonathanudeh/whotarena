import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useUser } from '../features/auth/useUser'
import SpinnerMini from './SpinnerMini'
import { useEffect } from 'react'

function ProtectedGameRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { matchId } = useParams()
  const { isFetchingUser, isAuthenticated } = useUser()

  // 1 Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isFetchingUser) navigate('/login', { replace: true })
  }, [isAuthenticated, isFetchingUser, navigate])

  // 2 Redirect if matchId is missing
  useEffect(() => {
    if (!matchId && !isFetchingUser) navigate('/lobby', { replace: true })
  }, [matchId, isFetchingUser, navigate])

  // 3 Lock browser back/forward buttons
  useEffect(() => {
    // Push current location twice to prevent back
    window.history.pushState(null, '', location.pathname)
    window.history.pushState(null, '', location.pathname)

    const handlePopState = () => window.history.pushState(null, '', location.pathname)
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [location.pathname])

  // 4 Loading state
  if (isFetchingUser)
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerMini />
      </div>
    )

  // All checks passed, render the game
  return children
}

export default ProtectedGameRoute
