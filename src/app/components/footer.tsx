import Link from 'next/link'
import Image from 'next/image'
export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 py-6 text-xs container max-w-screen-lg mx-auto text-slate-400">
        <div className='flex flex-row gap-4 justify-center'>
          <p>© {new Date().getFullYear()} ScoreLord. All rights reserved.</p>
          <Link  href="https://github.com/mattjared/scorelord" target="_blank" className="text-gray-400 hover:text-white transition-colors">Code on GitHub</Link>
          <Link  href="https://vercel.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">Deployed with Vercel</Link>
          <Link href="https://mattjared.xyz" target='_blank' className='text-gray-400 hover:text-white transition-colors'>Made by Matt Jared</Link>
        </div>
        <Image src="/logo.webp" alt="Scorelord Logo" width={300} height={300} className="mx-auto my-20" />
    </footer>
  )
}
