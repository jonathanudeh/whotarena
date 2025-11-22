import toast from 'react-hot-toast'
import { IoCopy } from 'react-icons/io5'

interface InfoRowProps {
  label: string
  value: string | number
  copy?: boolean
}

function InfoRow({ label, value, copy }: InfoRowProps) {
  const handleCopy = () => {
    const textToCopy = String(value)

    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Modern approach
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => toast.success(`${label} copied!`))
        .catch(() => fallbackCopy(textToCopy))
    } else {
      // Fallback for iOS / older browsers
      fallbackCopy(textToCopy)
    }
  }

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed' // prevent scrolling to bottom
    textarea.style.opacity = '1'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      document.execCommand('copy')
      toast.success(`${label} copied!`)
    } catch (err) {
      toast.error('Failed to copy ' + err)
    }

    document.body.removeChild(textarea)
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button onClick={handleCopy} className="flex items-center gap-2">
        <span className="font-bold">{value}</span>
        {copy && (
          <div className="text-green-400">
            <IoCopy className="h-4 w-4" />
          </div>
        )}
      </button>
    </div>
  )
}

export default InfoRow
