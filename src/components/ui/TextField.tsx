'use client'

// 'use client' is required: the <input> has an onChange handler, and event handlers
// only exist in the browser (a server component cannot attach them).
type TextFieldProps = {
  label: string
  name: string
  type: 'email' | 'password'
  value: string
  onChange: (value: string) => void
  autoComplete?: 'email' | 'current-password' | 'new-password'
}

const TextField = ({ label, name, type, value, onChange, autoComplete }: TextFieldProps) => (
  // The input is inside the label: the browser links them on its own (no htmlFor/id needed)
  <label className="flex w-full flex-col gap-[7px] text-sm text-black">
    {label}
    <input
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      className="h-[53px] w-full rounded-[4px] border border-neutral-grey-200 bg-neutral-white px-[17px] focus:border-brand-dark-orange focus:outline-none focus:ring-1 focus:ring-brand-dark-orange"
    />
  </label>
)

export default TextField
