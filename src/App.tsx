import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Error from './components/Error'
import Lobby from './pages/Lobby'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Tournament from './pages/Tournament'
import UserProfile from './pages/UserProfile'
import UserWallet from './pages/UserWallet'
import Settings from './pages/Settings'
import AdminLayout from './components/AdminLayout'
import AdminRooms from './pages/AdminRooms'
import AdminDashboard from './pages/AdminDashboard'
import AdminTournaments from './pages/AdminTournaments'
import AdminTransactions from './pages/AdminTransactions'
import AdminUsers from './pages/AdminUsers'
import AdminSettings from './pages/AdminSettings'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import UserLayout from './components/UserLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0
    }
  }
})

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      { index: true, element: <Navigate to="/lobby" replace /> },
      { path: '/lobby', element: <Lobby /> },
      { path: '/profile', element: <UserProfile /> },
      { path: '/wallet', element: <UserWallet /> },
      { path: '/settings', element: <Settings /> },
      { path: '/tournament', element: <Tournament /> }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true, path: 'dashboard', element: <AdminDashboard /> },
      { path: 'rooms', element: <AdminRooms /> },
      { path: 'tournaments', element: <AdminTournaments /> },
      { path: 'transactions', element: <AdminTransactions /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'settings', element: <AdminSettings /> }
    ]
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: {
            duration: 3000
          },
          error: {
            duration: 5000
          },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px'
            // backgroundColor: "",
          }
        }}
      />
    </QueryClientProvider>
  )
}

export default App
