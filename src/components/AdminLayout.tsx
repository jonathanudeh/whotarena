import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminMobileNav from './AdminMobileNav'
import { useState } from 'react'

function AdminLayout() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div className="bg-background text-main-text min-h-screen md:grid md:grid-cols-[20rem_1fr] md:grid-rows-[auto_1fr]">
      <AdminHeader onNavbarOpen={setNavbarOpen} />
      <AdminSidebar />
      {navbarOpen && <AdminMobileNav navbarOpen={navbarOpen} onNavbarOpen={setNavbarOpen} />}
      <main className="px-5 py-10">
        <div className="flex max-w-480 flex-col gap-2 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
