import { useEffect, useRef, useState } from 'react'

export function usePlayersCount(roomId: number, max = 35) {
  const min = 0

  // Stable initial value per room using a seed
  const seed = Math.abs(Math.sin(roomId * 9999) * 10000)
  const initial = Math.floor(min + (seed % (max + 1)))

  const [count, setCount] = useState(initial)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function scheduleNextChange() {
      // Random delay between 2–10 seconds
      const delay = 2000 + Math.random() * 5000

      timeoutRef.current = setTimeout(() => {
        setCount((prev) => {
          // Decide direction: mostly stable
          const r = Math.random()
          let delta = 0

          if (r < 0.5)
            delta = 0 // stay
          else if (r < 0.8)
            delta = 2 // +2
          else if (r < 0.95)
            delta = -3 // -3
          else delta = Math.floor(Math.random() * 3) * (Math.random() < 0.5 ? -2 : 2) // ±2 or 3 occasionally

          let next = prev + delta
          if (next < min) next = min
          if (next > max) next = max

          return next
        })

        scheduleNextChange()
      }, delay)
    }

    scheduleNextChange()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [roomId, max])

  return count
}
