import type { Shape } from './types'

interface ShapeIconProps {
  shape: Shape
  className?: string
}

// SVG Shapes for Cards
export const ShapeIcon = ({ shape, className }: ShapeIconProps) => {
  const commonProps = {
    className: className,
    fill: 'currentColor',
    stroke: 'currentColor',
    strokeWidth: '0'
  }

  switch (shape.toLowerCase()) {
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    case 'square':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    case 'cross':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M20 9h-5V4h-6v5H4v6h5v5h6v-5h5v-6z" />
        </svg>
      )
    case 'whot':
      return <span className="font-serif text-2xl font-black text-[#8B0000] italic">WHOT</span>

    default:
      return null
  }
}
