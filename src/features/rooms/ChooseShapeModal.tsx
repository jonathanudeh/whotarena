import { ShapeIcon } from './ShapeIcon'

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'cross'

export default function ChooseShapeModal({ onPick }: { onPick: (shape: ShapeType) => void }) {
  const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'cross']

  function handlePickShape(shape: ShapeType) {
    onPick(shape)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-card-bg space-y-3 rounded-lg p-4">
        <h2 className="text-center text-xl font-bold">Choose a shape</h2>

        <div className="grid grid-cols-3 gap-3">
          {shapes.map((shape) => (
            <button
              key={shape}
              className="rounded bg-white p-2 text-center"
              onClick={() => handlePickShape(shape)}
            >
              <ShapeIcon shape={shape} className="h-20 w-20 text-[#8B0000]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
