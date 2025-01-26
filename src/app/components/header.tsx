import Image from 'next/image'

export default function Header() {
  return (
    <div className="flex flex-col py-10">
      <h1 className="text-5xl font-bold text-teal-500 tracking-tight mb-2">Welcome to Scorelord</h1>
      <p className="text-white mb-8">All the scores. None of the ads. The cauldron is calling.</p>
      <Image src="/logo.webp" alt="Scorelord Logo" width={400} height={400} />
    </div>
  )
}
