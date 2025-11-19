import type { ReactElement } from 'react'

interface InputRowProps<T extends { id?: string }> {
  label?: string
  error?: string
  children: ReactElement<T>
}

function InputRow<T extends { id?: string }>({ label, error, children }: InputRowProps<T>) {
  return (
    <div>
      {label && <label htmlFor={children.props.id}>{label}</label>}
      {children}
      {error && <span className="text-text-danger">{error}</span>}
    </div>
  )
}

export default InputRow
