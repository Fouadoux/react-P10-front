type ButtonProps = {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  // Id of the <form> to submit when the button is placed outside of it
  form?: string
  // Horizontal size: the mockup fixes the width of some buttons (e.g. "w-[181px]"); by default the label sets it
  widthClassName?: string
}

// No 'use client': Button has no state of its own. It becomes a client component only
// when it is imported from one (for example to receive an onClick).
// Default type is 'button': a plain <button> inside a <form> would otherwise submit it by accident.
// Disabled look from the mockup: light grey background, grey text.
const Button = ({ label, onClick, type = 'button', disabled, form, widthClassName = 'px-[74px]' }: ButtonProps) => (
  <button
    type={type}
    form={form}
    disabled={disabled}
    onClick={onClick}
    className={`h-[50px] cursor-pointer rounded-[10px] bg-neutral-grey-800 ${widthClassName} text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange disabled:cursor-not-allowed disabled:bg-neutral-grey-200 disabled:text-[#9ca3af]`}
  >
    {label}
  </button>
)

export default Button
