import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import SpinnerMini from '../../components/SpinnerMini'
import { useLogIn } from './useLogIn'
import { useState } from 'react'
import InputRow from '../../components/InputRow'

const className =
  'bg-background border-border/30 focus:border-border/50 w-full rounded-lg border-2 px-4 py-3 text-white placeholder-gray-400 outline-none'

function LogInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { logIn, IsLoggingIn } = useLogIn()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    logIn(
      { email, password },
      {
        onSettled: () => {
          setEmail('')
          setPassword('')
        }
      }
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-card-bg text-main-text w-full max-w-md rounded-2xl p-4"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-center text-3xl font-bold text-yellow-400">Welcome Back </h2>

        <InputRow label="Email">
          <input
            type="email"
            id="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={IsLoggingIn}
            className={className}
          />
        </InputRow>

        <InputRow label="Password">
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={IsLoggingIn}
            className={className}
          />
        </InputRow>

        <Button size="large" disabled={IsLoggingIn}>
          {IsLoggingIn ? <SpinnerMini /> : 'Log in'}
        </Button>

        <p className="text-center text-sm text-gray-400">
          <span> Don't have an account? </span>
          <Link to="/signup" className="text-main-text font-bold">
            Sign Up
          </Link>
        </p>
      </form>
    </motion.div>
  )
}

export default LogInForm
