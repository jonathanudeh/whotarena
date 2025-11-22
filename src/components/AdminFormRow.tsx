import type { ReactElement } from 'react'

interface AdminFormRowProps {
  label?: string
  error?: string
  classname?: string
  children: ReactElement<{ id?: string }> // we tell TS that children has optional id prop
}

function AdminFormRow({ label, error, classname = '', children }: AdminFormRowProps) {
  return (
    <div className={classname}>
      {label && children.props.id && (
        <label className="text-slate-300" htmlFor={children.props.id}>
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-red">{error}</span>}
    </div>
  )
}

export default AdminFormRow
