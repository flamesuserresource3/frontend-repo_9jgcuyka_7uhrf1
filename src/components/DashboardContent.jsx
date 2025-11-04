import { useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

function StatCard({ title, value, delta, positive }) {
  return (
    <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
      <p className="text-xs uppercase tracking-wider text-white/50">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${
          positive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
        }`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta}
        </span>
      </div>
    </div>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let cumulative = 0
  const [hover, setHover] = useState(null)

  const arcs = data.map((d, i) => {
    const start = (cumulative / total) * 2 * Math.PI
    cumulative += d.value
    const end = (cumulative / total) * 2 * Math.PI
    const largeArc = end - start > Math.PI ? 1 : 0
    const r = 44
    const cx = 56
    const cy = 56
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return { path, color: d.color, label: d.label, value: d.value, i }
  })

  return (
    <div className="flex items-center gap-4">
      <svg width="112" height="112" viewBox="0 0 112 112" className="shrink-0">
        <defs>
          <radialGradient id="hole">
            <stop offset="55%" stopColor="#0f1320" />
            <stop offset="60%" stopColor="#0f1320" />
          </radialGradient>
        </defs>
        {arcs.map((a, idx) => (
          <path
            key={idx}
            d={a.path}
            fill={a.color}
            opacity={hover === idx ? 1 : 0.9}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        <circle cx="56" cy="56" r="32" fill="url(#hole)" stroke="#0f1320" strokeWidth="2" />
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-sm text-white/80">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="w-28">{d.label}</span>
            <span className="text-white">{((d.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ series, labels }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(...series)
  return (
    <div className="relative w-full h-48 flex items-end gap-3">
      {series.map((v, i) => {
        const h = (v / max) * 100
        return (
          <div key={i} className="flex-1 relative">
            <div
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="w-full rounded-md bg-gradient-to-t from-indigo-600 to-purple-500"
              style={{ height: `${h}%` }}
            />
            <p className="mt-2 text-xs text-white/60 text-center">{labels[i]}</p>
            {hover === i && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap">
                ${v.toLocaleString()}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function useSorted(data, defaultKey) {
  const [sort, setSort] = useState({ key: defaultKey, dir: 'desc' })
  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (typeof av === 'number') return sort.dir === 'asc' ? av - bv : bv - av
      return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
  }, [data, sort])
  function requestSort(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))
  }
  return { sorted, sort, requestSort }
}

export default function DashboardContent() {
  const [range, setRange] = useState('Monthly')

  const donutData = [
    { label: 'Card Payments', value: 4200, color: '#60a5fa' },
    { label: 'Transfers', value: 2600, color: '#a78bfa' },
    { label: 'Subscriptions', value: 1800, color: '#34d399' },
    { label: 'Fees', value: 600, color: '#f59e0b' },
  ]

  const barsMonthly = [12000, 15800, 13200, 16500, 17800, 21000, 19800]
  const barsWeekly = [3800, 4200, 3900, 5200, 6100, 5800, 6400]
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const rows = [
    { id: 'TX-98231', name: 'Acme Inc.', type: 'Invoice', amount: 2450.0, status: 'Paid', date: '2025-10-02' },
    { id: 'TX-98219', name: 'Nimbus LLC', type: 'Payout', amount: 1200.0, status: 'Pending', date: '2025-10-02' },
    { id: 'TX-98177', name: 'Aurora Bank', type: 'Transfer', amount: 5000.0, status: 'Completed', date: '2025-10-01' },
    { id: 'TX-98132', name: 'Blue Harbor', type: 'Refund', amount: -140.0, status: 'Processed', date: '2025-09-30' },
    { id: 'TX-98118', name: 'Skyline Co.', type: 'Invoice', amount: 890.0, status: 'Paid', date: '2025-09-29' },
  ]

  const { sorted, sort, requestSort } = useSorted(rows, 'date')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value="$128,940" delta="3.4%" positive />
        <StatCard title="Monthly Revenue" value="$42,560" delta="8.1%" positive />
        <StatCard title="Expenses" value="$19,320" delta="2.3%" positive={false} />
        <StatCard title="Active Subscriptions" value="1,248" delta="1.8%" positive />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Revenue Performance</p>
              <h3 className="text-xl font-semibold">{range} Overview</h3>
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              {['Weekly', 'Monthly'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`text-sm px-3 py-1.5 rounded-md ${
                    range === r ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <BarChart series={range === 'Weekly' ? barsWeekly : barsMonthly} labels={labels} />
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
          <p className="text-sm text-white/60">Spending Breakdown</p>
          <h3 className="text-xl font-semibold">This Month</h3>
          <div className="mt-4">
            <DonutChart data={donutData} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-white/60">Recent Activity</p>
            <h3 className="text-xl font-semibold">Transactions</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm px-3 py-1.5 rounded-md bg-white text-black">Export CSV</button>
          </div>
        </div>
        <table className="min-w-[640px] w-full text-sm">
          <thead>
            <tr className="text-left text-white/60">
              {[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Counterparty' },
                { key: 'type', label: 'Type' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
                { key: 'date', label: 'Date' },
              ].map((col) => (
                <th key={col.key} className="py-2 font-normal cursor-pointer" onClick={() => requestSort(col.key)}>
                  <div className="inline-flex items-center gap-1">
                    {col.label}
                    {sort.key === col.key && (
                      <span className="text-[10px] text-white/40">{sort.dir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-3">{r.id}</td>
                <td className="py-3">{r.name}</td>
                <td className="py-3 text-white/70">{r.type}</td>
                <td className={`py-3 ${r.amount < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{r.amount < 0 ? '-$' + Math.abs(r.amount).toFixed(2) : '$' + r.amount.toFixed(2)}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded text-xs border border-white/10 bg-white/5">{r.status}</span>
                </td>
                <td className="py-3 text-white/60">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
