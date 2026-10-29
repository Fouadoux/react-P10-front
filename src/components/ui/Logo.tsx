import Image from 'next/image'

type LogoProps = {
  className?: string
}

// Abricot brand logo (orange variant); default size from the login mockup, override it with `className`
// width/height are the SVG's natural size: next/image uses them to reserve space and avoid layout shift
const Logo = ({ className = 'h-[32px] w-[253px]' }: LogoProps) => (
  <Image src="/images/logo-abricot.svg" alt="Abricot" width={253} height={32} className={className} priority />
)

export default Logo
