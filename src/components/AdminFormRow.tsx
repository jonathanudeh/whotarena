function AdminFormRow({ label, error, children }) {
  return (
    <div>
      {label && (
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
