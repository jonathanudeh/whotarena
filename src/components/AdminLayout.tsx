import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminMobileNav from './AdminMobileNav'
import { useState } from 'react'

function AdminLayout() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div className="bg-background text-main-text min-h-screen md:grid md:h-screen md:grid-cols-[20rem_1fr] md:grid-rows-[auto_1fr]">
      <AdminHeader onNavbarOpen={setNavbarOpen} />
      <AdminSidebar />
      {navbarOpen && <AdminMobileNav onNavbarOpen={setNavbarOpen} />}
      <main className="no-scrollbar overflow-scroll px-5 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
