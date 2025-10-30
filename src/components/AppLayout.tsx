import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="min-h-screen bg-red-950 text-gray-50">
      <Outlet />
    </div>
  )
}

export default AppLayout
