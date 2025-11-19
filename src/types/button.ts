import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariation = 'primary' | 'secondary' | 'danger' | 'logOut'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: ButtonSize
  variation?: ButtonVariation
  onClick?: () => void
}
