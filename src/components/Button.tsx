import type { ButtonProps } from '../types/button'

function Button({
  children,
  onClick,
  size = 'small',
  variation = 'primary',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = 'flex cursor-pointer items-center justify-center rounded-sm text-white  '

  let className

  if (size === 'small') className = baseStyle + 'px-3 py-2 font-semibold '
  if (size === 'medium') className = baseStyle + ''
  if (size === 'large') className = baseStyle + 'w-full p-4 text-lg font-bold '

  if (variation === 'primary') className += 'bg-btn-primary hover:btn-pri-hover'
  if (variation === 'secondary') className += ''
  if (variation === 'danger') className += ''
  if (variation === 'logOut')
    className +=
      'bg-card-bg flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-red-500'

  return (
    <button className={className} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
