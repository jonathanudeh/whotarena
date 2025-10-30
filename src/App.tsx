import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Error from './components/Error'
import Lobby from './pages/Lobby'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Tournament from './pages/Tournament'
import Admin from './pages/Admin'
import UserProfile from './pages/UserProfile'
import UserWallet from './pages/UserWallet'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Lobby />
      },
      {
        path: '/profile',
        element: <UserProfile />
      },
      {
        path: '/wallet',
        element: <UserWallet />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/tournament',
        element: <Tournament />
      },
      {
        path: '/Admin',
        element: <Admin />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
