// hooks/useCountdown.ts
import { useCallback, useEffect, useState } from 'react'
import { formatTimeRemaining } from '../utils/helper'

export function useCountdown(endAt: string | Date) {
  const calcDiff = useCallback(() => {
    const now = new Date()
    const end = new Date(endAt)

    const diffMs = end.getTime() - now.getTime()

    if (diffMs <= 0) {
      return {
        formatted: 'Closed',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    const totalSeconds = Math.floor(diffMs / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      formatted: formatTimeRemaining(endAt),
      days,
      hours,
      minutes,
      seconds
    }
  }, [endAt])

  const [timeLeft, setTimeLeft] = useState(calcDiff)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcDiff())
    }, 1000)

    return () => clearInterval(interval)
  }, [endAt, calcDiff])

  return timeLeft
}
