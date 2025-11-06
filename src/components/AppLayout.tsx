import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="min-h-screen text-gray-50">
      <Outlet />
    </div>
  )
}

export default AppLayout
