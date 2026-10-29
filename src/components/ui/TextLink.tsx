import Link from 'next/link'

type TextLinkProps = {
  label: string
  href: string
}

// next/link navigates without a full page reload; `href` is required (an <a> without it is not a link)
const TextLink = ({ label, href }: TextLinkProps) => (
  <Link href={href} className="text-sm text-brand-dark-orange underline">{label}</Link>
)

export default TextLink
