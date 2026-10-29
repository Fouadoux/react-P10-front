import Image from 'next/image'

// Footer from the mockup: black logo on the left, copyright on the right
const Footer = () => (
  <footer className="flex h-17 items-center justify-between bg-neutral-white px-[30px]">
    <Image src="/images/logo-abricot-black.svg" alt="Abricot" width={101} height={13} className="h-[12.9px] w-[101px]" />
    <p className="text-base text-black">Abricot 2025</p>
  </footer>
)

export default Footer
