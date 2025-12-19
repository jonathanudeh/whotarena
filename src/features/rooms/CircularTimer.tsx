interface CircularTimerProps {
  timeLeft: number
  total: number
  size?: number
}

export default function CircularTimer({ timeLeft, total, size = 80 }: CircularTimerProps) {
  const progress = (timeLeft / total) * 100
  const strokeColor = timeLeft <= 3 ? 'red' : 'green'
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
        <text
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={strokeColor}
        >
          {Math.ceil(timeLeft)}
        </text>
      </svg>
    </div>
  )
}
