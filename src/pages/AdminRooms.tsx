import { useState } from 'react'
import AddRoomFormModal from '../features/admin/AddRoomFormModal'
import RoomTable from '../features/admin/RoomTable'
import { LuPlus } from 'react-icons/lu'

function AdminRooms() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase md:text-2xl">Manage rooms</h1>

        <button
          className="flex cursor-pointer items-center rounded-lg bg-green-500 px-3 py-2 font-semibold text-white shadow-sm hover:bg-green-600"
          onClick={() => setShowForm(true)}
        >
          <LuPlus size={20} /> Add Room
        </button>
      </div>

      <RoomTable />

      {showForm && <AddRoomFormModal onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default AdminRooms
