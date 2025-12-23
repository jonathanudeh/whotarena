// features/rooms/components/GameArea/PlayerHand.tsx
import { CardComponent } from '../../CardComponent'
import type { Card } from '../../types'

interface PlayerHandProps {
  hand: Card[]
  onCardClick: (card: Card) => void
}

export default function PlayerHand({ hand, onCardClick }: PlayerHandProps) {
  return (
    <div className="absolute right-0 bottom-2 left-0 px-2">
      <div className="no-scrollbar flex w-full items-center justify-center gap-2 overflow-x-scroll pb-2">
        {hand.map((card) => (
          <CardComponent
            key={card.id}
            num={card.num}
            shape={card.shape}
            onClick={() => onCardClick(card)}
            className="h-36 w-24 shrink-0 rotate-0 transform md:h-48 md:w-32"
          />
        ))}
      </div>
    </div>
  )
}
