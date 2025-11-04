import { Home, BarChart3, PieChart, Wallet, Activity, Settings, Bell, User, ChevronRight } from 'lucide-react'

const nav = [
  {
    title: 'Overview',
    items: [
      { icon: Home, label: 'Dashboard', active: true },
      { icon: BarChart3, label: 'Analytics' },
      { icon: PieChart, label: 'Reports' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: Wallet, label: 'Accounts' },
      { icon: Activity, label: 'Transactions' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: Bell, label: 'Notifications' },
      { icon: User, label: 'Profile' },
      { icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#0c0f14]/90 backdrop-blur supports-[backdrop-filter]:bg-[#0c0f14]/80 border-r border-white/10 text-white">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg" />
        <div>
          <p className="font-semibold leading-tight">FinSight</p>
          <p className="text-xs text-white/60">Modern Finance Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {nav.map((section) => (
          <div key={section.title} className="px-4">
            <p className="px-2 text-[11px] uppercase tracking-wider text-white/40 mt-6 mb-2">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <button
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition ${
                      item.active ? 'bg-white/10 border-white/10' : ''
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} className="text-white/70" />
                      <span className="text-sm">{item.label}</span>
                    </span>
                    <ChevronRight size={16} className="text-white/30 group-hover:text-white/60" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#151923] to-[#0e1218] border border-white/10">
          <p className="text-sm font-medium mb-2">Pro Plan</p>
          <p className="text-xs text-white/60 mb-3">Unlock advanced analytics and real-time insights.</p>
          <button className="w-full text-center text-sm font-semibold bg-white text-black rounded-lg py-2 hover:bg-white/90 transition">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  )
}
