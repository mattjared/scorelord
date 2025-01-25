import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} ScoreLord. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link 
              href="https://github.com/mattjared/scorelord" 
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </Link>
            <Link 
              href="https://astro.build/themes/details/astropaper/"
              target='_blank'
              className='text-gray-400 hover:text-white transition-colors'
            >
              Design inspired by Astropaper
            </Link>
            <Link 
              href="/about" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
