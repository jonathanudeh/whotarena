import { ShapeIcon } from './ShapeIcon'
import type { Shape } from './types'

// interface CardProps {
//   num?: number
//   shape?: Shape
//   isFaceDown?: boolean
//   onClick?: () => void
//   className?: string
//   style?: React.CSSProperties
// }

interface FaceDownCardProps {
  isFaceDown: true
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

interface FaceUpCardProps {
  isFaceDown?: false
  num: number
  shape: Shape
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

type CardProps = FaceDownCardProps | FaceUpCardProps

export const CardComponent: React.FC<CardProps> = (props) => {
  const { onClick, className = '', style = {} } = props

  if (props.isFaceDown) {
    return (
      <div
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-white/20 bg-[#D32F2F] shadow-xl ${className}`}
        style={style}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-black to-transparent opacity-10" />
        <div className="flex flex-col items-center justify-center gap-1 opacity-90">
          <span
            className="rotate-180 font-serif text-3xl font-bold tracking-widest text-white"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Whot
          </span>
          <span
            className="font-serif text-3xl font-bold tracking-widest text-white"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Whot
          </span>
        </div>
      </div>
    )
  }

  const { num, shape } = props

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-2 shadow-xl ${className}`}
      style={style}
    >
      <div className="flex flex-col items-center self-start leading-none">
        <span className="text-xl font-bold text-[#8B0000]">{num}</span>
        <ShapeIcon shape={shape} className="h-4 w-4 text-[#8B0000]" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <ShapeIcon shape={shape} className="h-16 w-16 text-[#8B0000] md:h-20 md:w-20" />
      </div>
      <div className="flex rotate-180 transform flex-col items-center self-end leading-none">
        <span className="text-xl font-bold text-[#8B0000]">{num}</span>
        <ShapeIcon shape={shape} className="h-4 w-4 text-[#8B0000]" />
      </div>
    </div>
  )
}
