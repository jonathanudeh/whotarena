// features/rooms/components/GameArea/DeckAndDiscard.tsx
import toast from 'react-hot-toast'
import type { Card } from '../../types'
import { pickFromMarket } from '../../../../services/apiGameService'
import { CardComponent } from '../../CardComponent'
import CircularTimer from '../../CircularTimer'

interface DeckAndDiscardProps {
  matchId: number
  userId: string
  deckCount: number
  topCard: Card | null
  showTimer: boolean
  timeLeft: number
}

export default function DeckAndDiscard({
  matchId,
  userId,
  deckCount,
  topCard,
  showTimer,
  timeLeft
}: DeckAndDiscardProps) {
  async function handlePickFromMarket() {
    try {
      if (!matchId || !userId) return
      await pickFromMarket({ matchId, userId })
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6">
      <div className="relative flex flex-1 items-center justify-center">
        {/* Background Circle */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          <div className="h-64 w-64 rounded-full border-8 border-yellow-400" />
        </div>

        <div className="z-10 flex items-center gap-8 md:gap-16">
          {/* Deck (Market) */}
          <div className="group relative">
            {deckCount > 3 && (
              <>
                <div className="absolute top-0 left-0 h-36 w-24 translate-x-2 translate-y-2 transform rounded-lg border border-white/20 bg-red-900 md:h-48 md:w-32" />
                <div className="absolute top-0 left-0 h-36 w-24 translate-x-1 translate-y-1 transform rounded-lg border border-white/20 bg-red-800 md:h-48 md:w-32" />
              </>
            )}

            <CardComponent
              isFaceDown
              onClick={handlePickFromMarket}
              className="h-36 w-24 cursor-pointer transition-transform duration-200 hover:-translate-y-2 md:h-48 md:w-32"
            />

            <div className="absolute -top-3 -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-purple-800 font-bold text-white shadow-lg">
              {deckCount}
            </div>

            <div className="text-shadow absolute -bottom-8 w-full text-center font-bold text-white">
              Market
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            {topCard ? (
              <CardComponent
                num={topCard.num}
                shape={topCard.shape}
                className="h-36 w-24 rotate-2 transform md:h-48 md:w-32"
              />
            ) : (
              <div className="flex h-36 w-24 items-center justify-center rounded-lg border-2 border-dashed border-white/30 text-white/50 md:h-48 md:w-32">
                Empty
              </div>
            )}
          </div>
        </div>

        {/* Turn Timer */}
        {showTimer && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-30 transform">
            <CircularTimer timeLeft={timeLeft} total={30} />
          </div>
        )}
      </div>
    </div>
  )
}
