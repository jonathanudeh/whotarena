export interface Player {
  id: string
  userId: string | null
  created_at: string
  playerType: 'human' | 'ai'
  displayName?: string
  avatarUrl?: string
  matchId?: number
  joinedAt?: string
}

export interface Profile {
  id: string
  userId: string
  username: string
  avatar: string
}

export type Shape = 'circle' | 'triangle' | 'cross' | 'square' | 'star' | 'whot'

export interface Card {
  id: string
  num: number
  shape: Shape
}

export interface Match {
  id: number
  roomId: number | null
  status: 'waiting' | 'playing' | 'ended' | 'finished'
  maxPlayers: number
  startedAt: string | null
  endedAt: string | null
  entryFee: number
  prize: number
  gameState: GameState | null
}

export interface GameState {
  deck: Card[]
  discardTop: Card | null
  hands: Record<string, Card[]>
  turn: string
  turnIndex: number
  playerOrder: string[]
  playerMeta: Record<string, PlayerMeta>
  stackedTwo: number
  requiredShape: string | null
  awaitingShapeChoice: string | null
  awaitingShapeEndTime: string | null
  skipped: string | null
  lastAction: LastAction | null
  status: 'waiting' | 'playing' | 'finished'
  finished: boolean
  winner: string | null
  turnEndTime: string
  createdAt: string
}

export interface PlayerMeta {
  userId: string | null
  type: 'human' | 'ai'
}

export interface LastAction {
  id: string
  type: 'play' | 'chooseShape'
  actor: string
  cardNum?: number
  cardShape?: string | null
  stackedTwo?: number
  target?: string | null
  shape?: string
  createdAt: string
}

export interface PlayerIdentity {
  name: string
  avatar: string | undefined
}

export interface OrderedPlayerData {
  player: Player
  key: string
  identity: PlayerIdentity
}

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'cross'
