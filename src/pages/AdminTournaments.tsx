import { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import TournamentTable from '../features/admin/tournaments/TournamentTable'
import AddTournamentModal from '../features/admin/tournaments/AddTournamentModal'

function AdminTournaments() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase md:text-2xl">Manage Tournaments</h1>

        <button
          className="flex cursor-pointer items-center rounded-lg bg-green-500 px-3 py-2 font-semibold text-white shadow-sm hover:bg-green-600"
          onClick={() => setShowForm(true)}
        >
          <FaPlus size={20} /> Add Tournament
        </button>
      </div>

      <TournamentTable />

      {showForm && <AddTournamentModal onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default AdminTournaments
