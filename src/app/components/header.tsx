
export default function Header() {
  // Get the current date and time
  const date = new Date();
  const time = date.toLocaleTimeString().slice(0, 4);
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return (
    <div className="py-5 mb-10 border-b border-gray-800 grid grid-cols-2 justify-between items-center align-middle gap-4">      
      <div className="grid grid-cols-1 gap-1">
        <h1 className="text-3xl font-black text-teal-500 tracking-tight">Scorelord</h1>
        <p className="text-slate-300 text-xs italic">Tiny site with none of the ads and all of the magic.</p>
      </div>
      <div className="text-lg font-bold text-purple-400 text-right">{day} {month} {dayOfMonth}, {year}</div>
    </div>
  )
}
