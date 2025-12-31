interface InfoRowProps {
  label: string
  value?: string | number
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-center text-sm text-gray-300">{label}</span>
      <div className="text-center">
        <span className="font-bold">{value}</span>
      </div>
    </div>
  )
}

export default InfoRow
