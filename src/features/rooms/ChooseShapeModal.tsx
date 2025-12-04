// src/components/ChooseShapeModal.tsx

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'cross'

export default function ChooseShapeModal({ onPick }: { onPick: (shape: ShapeType) => void }) {
  const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'cross']

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="space-y-3 rounded-lg bg-white p-4">
        <h2 className="text-center text-lg font-bold">Choose a shape</h2>

        <div className="grid grid-cols-2 gap-3">
          {shapes.map((shape) => (
            <button
              key={shape}
              className="rounded bg-gray-200 p-2 text-center"
              onClick={() => onPick(shape)}
            >
              {shape.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
