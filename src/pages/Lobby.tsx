import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Header from './Header'
import RoomCard from '../features/rooms/card'
import { IoFlash } from 'react-icons/io5'
import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../services/apiRooms'

// Mock Data
const mockRooms = [
  {
    id: 2,
    type: 'regular',
    prize: 26000,
    entryFee: 15000,
    currentPlayers: 2,
    maxPlayers: 2,
    timeLeft: '00:37',
    status: 'waiting'
  },
  {
    id: 1,
    type: 'tournament',
    title: 'Whot Naira League',
    prize: 30000,
    entryFee: 300,
    players: 2053,
    maxPlayers: 3000,
    timeLeft: '08h:56m',
    status: 'filling'
  },
  {
    id: 3,
    type: 'regular',
    prize: 13500,
    entryFee: 8000,
    currentPlayers: 0,
    maxPlayers: 2,
    timeLeft: '00:44',
    status: 'waiting'
  },
  {
    id: 4,
    type: 'regular',
    prize: 5000,
    entryFee: 3000,
    currentPlayers: 1,
    maxPlayers: 2,
    timeLeft: '00:29',
    status: 'waiting'
  }
]

function Lobby() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  return (
    <div className="bg-950 min-h-screen text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pb-8">
        <LobbyPage />
      </main>
    </div>
  )
}

export default Lobby

function LobbyPage() {
  return (
    <div className="space-y-4 px-4">
      <motion.div
        className="py-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 text-xl font-bold text-yellow-400">
          <IoFlash className="h-6 w-6" />
          <span>Wild Weekend</span>
          <IoFlash className="h-6 w-6" />
        </div>
      </motion.div>

      {mockRooms.map((room, index) =>
        room.type === 'tournament' ? <RoomCard key={room.id} room={room} delay={index * 0.1} /> : ''
      )}

      {mockRooms.map((room, index) =>
        room.type !== 'tournament' ? <RoomCard key={room.id} room={room} delay={index * 0.1} /> : ''
      )}
    </div>
  )
}
