import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Login() {
  return (
    <div className="flex h-dvh items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-red-900 p-4"
      >
        <div className="space-y-6">
          <h2 className="text-center text-3xl font-bold text-yellow-400">Welcome Back </h2>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border-2 border-yellow-400/30 bg-red-800 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border-2 border-yellow-400/30 bg-red-800 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-yellow-400"
          />

          <button className="w-full rounded-xl bg-linear-to-r from-yellow-500 to-yellow-400 py-4 font-bold text-red-900">
            <Link to="/">Login</Link>
          </button>

          <p className="text-center text-sm text-gray-400">
            <span> Don't have an account? </span>
            <Link to="/signup" className="font-bold text-yellow-400">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
