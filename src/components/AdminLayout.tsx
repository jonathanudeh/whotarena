import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminMobileNav from './AdminMobileNav'
import { useState } from 'react'

function AdminLayout() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 md:grid md:grid-cols-[20rem_1fr] md:grid-rows-[auto_1fr]">
      <AdminHeader onNavbarOpen={setNavbarOpen} />
      <AdminSidebar />
      {navbarOpen && <AdminMobileNav navbarOpen={navbarOpen} onNavbarOpen={setNavbarOpen} />}
      <main className="px-5 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
