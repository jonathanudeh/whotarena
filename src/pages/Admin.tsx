import { useState } from 'react'
import { IoAdd, IoArrowBack, IoCheckmarkCircle, IoClose } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { getRooms } from '../services/apiRooms'
import { useQuery } from '@tanstack/react-query'
import Lobby from './Lobby'

function Admin() {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms
  })

  console.log(rooms)

  const [pendingDeposits] = useState([
    {
      id: 1,
      user: 'Player_123',
      amount: 10000,
      proof: 'screenshot.jpg',
      date: '2025-10-29 09:15'
    },
    { id: 2, user: 'Player_456', amount: 5000, proof: 'receipt.jpg', date: '2025-10-29 10:30' }
  ])

  if (isLoading) return <Lobby />

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => window.history.back()} className="text-yellow-400">
          <IoArrowBack className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="rounded-2xl bg-red-800/50 p-6">
        <h3 className="mb-4 text-lg font-bold text-yellow-400">Pending Deposits</h3>
        <div className="space-y-4">
          {pendingDeposits.map((deposit) => (
            <div key={deposit.id} className="space-y-3 rounded-xl bg-red-900/50 p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{deposit.user}</p>
                  <p className="text-sm text-gray-400">{deposit.date}</p>
                </div>
                <p className="text-xl font-bold text-yellow-400">
                  ₦{deposit.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 rounded-lg bg-green-600 py-2 font-bold text-white"
                >
                  <IoCheckmarkCircle className="mr-1 inline h-5 w-5" />
                  Approve
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 rounded-lg bg-red-600 py-2 font-bold text-white"
                >
                  <IoClose className="mr-1 inline h-5 w-5" />
                  Reject
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-yellow-500 to-yellow-400 py-4 font-bold text-red-900"
      >
        <IoAdd className="h-6 w-6" />
        Create New Room
      </motion.button>
    </div>
  )
}

export default Admin
