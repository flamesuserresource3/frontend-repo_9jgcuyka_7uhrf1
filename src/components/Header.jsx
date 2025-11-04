import { Search, Bell, Moon, SunMedium, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <header className="h-20 w-full flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-[#0c0f14]/80 backdrop-blur text-white">
      <div className="flex items-center gap-3 w-1/2">
        <div className="relative flex-1 max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            placeholder="Search analytics, accounts, transactions..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDark((d) => !d)}
          className="h-10 w-10 grid place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {dark ? <SunMedium size={18} /> : <Moon size={18} />}
        </button>
        <button className="h-10 w-10 grid place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="h-10 rounded-lg bg-white/5 border border-white/10 px-2 flex items-center gap-2">
          <img src="https://i.pravatar.cc/40?img=12" alt="avatar" className="h-7 w-7 rounded-md object-cover" />
          <span className="hidden md:block text-sm">Alex Morgan</span>
          <ChevronDown size={16} className="text-white/50" />
        </div>
      </div>
    </header>
  )
}
