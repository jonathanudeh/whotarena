import type { Player, Profile, PlayerIdentity } from '../types'

export function getPlayerKey(player: Player): string {
  return String(player.userId ?? player.id)
}

export function getPlayerIdentity(
  player: Player,
  profiles: Record<string, Profile>
): PlayerIdentity {
  // AI player
  if (!player.userId) {
    return {
      name: player.displayName ?? 'AI Player',
      avatar: player.avatarUrl
    }
  }

  // Human player
  return {
    name: profiles[player.userId]?.username ?? 'Player',
    avatar: profiles[player.userId]?.avatar
  }
}

export function getPositionStyle(index: number, total: number): string {
  if (total === 1) {
    return 'bottom-6 left-1/2 -translate-x-1/2'
  }

  if (total === 2) {
    return index === 0 ? 'bottom-6 left-1/2 -translate-x-1/2' : 'top-6 left-1/2 -translate-x-1/2'
  }

  if (total === 3) {
    if (index === 0) return 'bottom-6 left-1/2 -translate-x-1/2'
    if (index === 1) return 'top-6 left-1/2 -translate-x-1/2'
    return 'left-6 top-1/2 -translate-y-1/2'
  }

  if (total === 4) {
    if (index === 0) return 'bottom-6 left-1/2 -translate-x-1/2'
    if (index === 1) return 'top-6 left-1/2 -translate-x-1/2'
    if (index === 2) return 'right-6 top-1/2 -translate-y-1/2'
    return 'left-6 top-1/2 -translate-y-1/2'
  }

  return ''
}
