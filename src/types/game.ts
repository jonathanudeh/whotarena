export type Shape = 'circle' | 'square' | 'triangle' | 'cross' | 'star' | 'whot'

export interface Card {
  id: string
  num: number
  shape: Shape
}

export interface Hands {
  [userId: string]: Card[]
}

export interface GameState {
  deck: Card[]
  discardTop: Card | null

  hands: Hands

  turn: string
  playerOrder: string[]
  turnIndex: number

  // Special rules
  requiredShape: Shape | null
  awaitingShapeChoice: string | null
  stackedTwo: number
  skipped: string | null

  // NEW (for WINNERS)
  winner: string | null
  finished: boolean

  // Optional metadata
  status: 'waiting' | 'playing' | 'finished'
  createdAt: string
}
