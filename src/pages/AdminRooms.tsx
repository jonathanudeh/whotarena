import { useState } from 'react'
import AddRoomFormModal from '../features/admin/AddRoomFormModal'
import RoomTable from '../features/admin/RoomTable'
import { LuPlus } from 'react-icons/lu'
import Button from '../components/Button'

function AdminRooms() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase md:text-2xl">Manage rooms</h1>

        <Button onClick={() => setShowForm(true)}>
          <LuPlus size={20} /> Add Room
        </Button>
      </div>

      <RoomTable />

      {showForm && <AddRoomFormModal onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default AdminRooms
