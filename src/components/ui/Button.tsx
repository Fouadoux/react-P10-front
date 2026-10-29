type ButtonProps = {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

// No 'use client': Button has no state of its own. It becomes a client component only
// when it is imported from one (for example to receive an onClick).
// Default type is 'button': a plain <button> inside a <form> would otherwise submit it by accident
const Button = ({ label, onClick, type = 'button', disabled }: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className="h-[50px] cursor-pointer rounded-[10px] bg-neutral-grey-800 px-[74px] text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange disabled:cursor-not-allowed disabled:opacity-50"
  >
    {label}
  </button>
)

export default Button
