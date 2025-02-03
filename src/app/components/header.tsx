import Image from 'next/image'

export default function Header() {
  return (
    <div className="py-10 mb-10 border-b border-gray-800 grid grid-cols-12 gap-4">
      <Image src="/logo.webp" alt="Scorelord Logo" width={275} height={275} className="col-span-4" />
      <div className="col-span-8">
        <h1 className="text-5xl font-black text-teal-500 tracking-tight mb-2">Welcome to Scorelord</h1>
        <p className="text-white mb-8 border-b border-gray-800 pb-4">All the scores. None of the ads.</p>
        <p className="text-white mb-4">A tiny site to show yesterdays scores and the scheduled games for today. Designed to be quick updates during the day to keep you in the loop.</p>
        <div className="flex justify-center gap-4">
          <a href="#NHL" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-8">NHL</a>
          <a href="#NBA" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-8">NBA</a>
          <a href="#MLB" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-8">MLB</a>
          <a href="#NFL" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-8">NFL</a>
          <a href="#EPL" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-8">EPL</a>
        </div>
        <p className="text-slate-500 italic text-center text-xs">The cauldron is calling.</p>
      </div>
    </div>
  )
}
