import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router-dom'

interface SettingsItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  text: string
  to: string
}

function SettingsItem({ icon: Icon, text, to }: SettingsItemProps) {
  return (
    <Link
      to={to}
      className="bg-card-bg hover:bg-card-bg/50 flex w-full items-center gap-4 rounded-xl p-4"
    >
      <Icon className="h-6 w-6 text-green-400" />
      <span className="font-medium">{text}</span>
    </Link>
  )
}

export default SettingsItem
