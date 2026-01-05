import { motion } from 'framer-motion'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import InputRow from '../../components/InputRow'
import { useSignUp } from './useSignUp'
import SpinnerMini from '../../components/SpinnerMini'
import type { SignUpCredentials } from '../../types/services'

const className =
  'bg-background border-border/30 focus:border-border/50 w-full rounded-xl border-2 px-4 py-3 text-white placeholder-gray-400 outline-none'

function SignUpForm() {
  const { signUp, isSigningUp } = useSignUp()
  const { register, handleSubmit, formState, reset } = useForm<SignUpCredentials>()
  const { errors } = formState

  // defaault avatar for user
  // const random = Math.random().toString(36).substring(7)

  function onSubmit({ email, password, username }: SignUpCredentials) {
    signUp(
      { email, password, username },
      {
        onSettled: () => reset()
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
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center text-3xl font-bold text-yellow-400">Join WhotArena</h2>

        <InputRow label="Email" error={errors?.email?.message}>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            disabled={isSigningUp}
            className={className}
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email should be valid'
              }
            })}
          />
        </InputRow>

        <InputRow label="Username" error={errors?.username?.message}>
          <input
            type="text"
            id="username"
            placeholder="username"
            disabled={isSigningUp}
            className={className}
            {...register('username', {
              required: 'This field is required'
            })}
          />
        </InputRow>

        <InputRow label="Password" error={errors?.password?.message}>
          <input
            type="password"
            id="password"
            placeholder="Password"
            disabled={isSigningUp}
            className={className}
            {...register('password', {
              required: 'This field is required',
              minLength: { value: 6, message: 'Password should be atleast 6 characters' }
            })}
          />
        </InputRow>

        <Button size="large" disabled={isSigningUp}>
          {isSigningUp ? <SpinnerMini /> : 'Sign up'}
        </Button>

        <p className="text-center text-sm text-gray-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-main-text font-bold">
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  )
}

export default SignUpForm
