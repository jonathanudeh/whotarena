interface StatCardProps {
  label: string
  value: string | number
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-card-bg rounded-2xl p-4 text-center">
      <p className="mb-1 text-sm text-gray-300">{label}</p>
      <p className="text-em-text text-2xl font-bold">{value}</p>
    </div>
  )
}

export default StatCard
