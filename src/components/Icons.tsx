// src/components/Icons.tsx
import React from 'react'

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1-1.4 1.4l-.1-.1a1 1 0 0 0-1.1-.2 7.1 7.1 0 0 1-1.6.9l.1.2a1 1 0 0 1-1.8.9l-.1-.2a7.1 7.1 0 0 1-2 .2 7.1 7.1 0 0 1-2-.2l-.1.2a1 1 0 0 1-1.8-.9l.1-.2a7.1 7.1 0 0 1-1.6-.9 1 1 0 0 0-1.1.2l-.1.1A1 1 0 0 1 2.4 16l.1-.1a1 1 0 0 0 .2-1.1 7.1 7.1 0 0 1-.2-2 7.1 7.1 0 0 1 .2-2 1 1 0 0 0-.2-1.1L2.5 9.2A1 1 0 0 1 3.9 7.8l.1.1a1 1 0 0 0 1.1.2c.5-.3 1-.6 1.6-.9l-.1-.2A1 1 0 0 1 8.7 7l.1.2c.6-.1 1.2-.2 2-.2s1.4.1 2 .2l.1-.2A1 1 0 0 1 14.3 7l-.1.2c.6.3 1.1.6 1.6.9a1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 1.4l-.1.1c.3.5.6 1 .9 1.6l.2-.1a1 1 0 0 1 .9 1.8l-.2.1c.3.6.5 1.2.5 2z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
)

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 6l12 12M6 18L18 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
