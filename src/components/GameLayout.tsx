import { Outlet } from 'react-router-dom'

function GameLayout() {
  return (
    <div className="bg-background min-h-screen text-white">
      <Outlet />
    </div>
  )
}

export default GameLayout
