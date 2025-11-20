import UserSidebar from '../features/user/UserSidebar'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import UserMobileNav from '../features/user/UserMobileNav'
import { useState } from 'react'

function UserLayout() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div className="bg-background min-h-screen text-white md:grid md:h-screen md:grid-cols-[20rem_1fr] md:grid-rows-[auto_1fr]">
      <Header onNavbarOpen={setNavbarOpen} />
      <UserSidebar />
      {navbarOpen && <UserMobileNav onNavbarOpen={setNavbarOpen} />}

      <main className="no-scrollbar overflow-scroll py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout
