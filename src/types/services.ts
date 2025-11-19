export interface SignUpCredentials {
  email: string
  password: string
  username: string
}

export interface LogInCredentials {
  email: string
  password: string
}

export type updateUserAvatarProps = { id: string; avatarFile: File | string }

export interface updateUserusernameProps {
  id: string
  username: string
}
