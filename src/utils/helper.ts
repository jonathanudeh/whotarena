// currency formatter
export function formatCurrency(amount: number, currency: string = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount)
}

//  format only the date (e.g. "11 Nov 2025")
export function formatDateOnly(date: string | Date) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

//  format only the time (e.g. "10:45 PM")
export function formatTimeOnly(date: string | Date) {
  return new Date(date).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Returns a formatted "Closes in Xh:Ym" or "Xd Yh"
export function formatTimeRemaining(endAt: string | Date) {
  const now = new Date()
  const end = new Date(endAt)

  const diffMs = end.getTime() - now.getTime()
  if (diffMs <= 0) return 'Closed'

  const totalMinutes = Math.floor(diffMs / 1000 / 60)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')

  return `${hh}h:${mm}m`
}
