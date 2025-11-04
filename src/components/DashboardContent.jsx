import { useMemo, useState } from 'react'
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function ToggleGroup({ value, onChange, options }) {
  return (
    <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-sm px-3 py-1.5 rounded-md ${value === opt ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
      >
        <span className="text-white/80">{value}</span>
        <ChevronDown size={16} className="text-white/50" />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-64 rounded-lg border border-white/10 bg-[#0f1320]/95 backdrop-blur shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${value === opt ? 'text-white' : 'text-white/80'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, delta, positive }) {
  return (
    <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
      <p className="text-xs uppercase tracking-wider text-white/50">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        {delta != null && (
          <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${positive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

function useSorted(data, defaultKey, defaultDir = 'desc') {
  const [sort, setSort] = useState({ key: defaultKey, dir: defaultDir })
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

function HorizontalBarChart({ data, unit = '%' }) {
  const max = Math.max(...data.map((d) => d.value))
  const [hover, setHover] = useState(null)
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white/80">{d.label}</span>
            <span className="text-sm text-white">{d.value}{unit}</span>
          </div>
          <div className="h-3 rounded-md bg-white/5 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${(d.value / max) * 100}%` }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          </div>
          {hover === i && (
            <div className="absolute -top-7 right-0 px-2 py-1 rounded bg-black/80 text-white text-xs">{d.label}: {d.value}{unit}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function HeatCell({ value, min, max, onHover }) {
  const t = (value - min) / Math.max(1e-9, max - min)
  // Interpolate blue (low) to red (high)
  const r = Math.round(255 * t)
  const g = Math.round(64 * (1 - t))
  const b = Math.round(160 * (1 - t) + 32 * t)
  const bg = `rgba(${r},${g},${b},0.35)`
  const border = `rgba(${r},${g},${b},0.6)`
  return (
    <td
      className="px-3 py-2 text-center text-sm rounded-md border"
      style={{ background: bg, borderColor: border }}
      onMouseEnter={onHover}
      onMouseLeave={() => onHover(null)}
    >
      <span className="text-white">{value.toFixed(2)}</span>
    </td>
  )
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  let acc = 0
  const [hover, setHover] = useState(null)
  const arcs = segments.map((s, idx) => {
    const start = (acc / total) * 2 * Math.PI
    acc += s.value
    const end = (acc / total) * 2 * Math.PI
    const largeArc = end - start > Math.PI ? 1 : 0
    const r = 60
    const cx = 75
    const cy = 75
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return { path, color: s.color, label: s.label, pct: (s.value / total) * 100 }
  })
  return (
    <div className="relative">
      <svg width="150" height="150" viewBox="0 0 150 150" className="block">
        <defs>
          <radialGradient id="donutHole">
            <stop offset="55%" stopColor="#0f1320" />
            <stop offset="60%" stopColor="#0f1320" />
          </radialGradient>
        </defs>
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.path}
            fill={a.color}
            opacity={hover === i ? 1 : 0.9}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        <circle cx="75" cy="75" r="40" fill="url(#donutHole)" stroke="#0f1320" strokeWidth="2" />
      </svg>
      {hover != null && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded bg-black/80 text-white text-xs">
          {arcs[hover].label}: {arcs[hover].pct.toFixed(1)}%
        </div>
      )}
    </div>
  )
}

export default function DashboardContent({ page }) {
  // Page 1 state
  const [compareMode, setCompareMode] = useState('Compare With Sector')
  const [company, setCompany] = useState('NVO Portfolio Management Inc.')
  const companies = [
    'NVO Portfolio Management Inc.',
    'Atlas Capital Partners LLC',
    'Summit Wealth Advisors Ltd.',
    'Aurora Asset Management Co.',
  ]

  // Page 1 data
  const metrics = [
    { title: 'Total Number of Funds', value: '75', delta: '2.1%', positive: true },
    { title: 'Total Assets Under Management', value: '75.7B TL', delta: '4.3%', positive: true },
    { title: 'Average Management Fee', value: '2.03%', delta: '0.1%', positive: false },
    { title: 'Average 1-Year Return', value: '23.61%', delta: '1.4%', positive: true },
  ]

  const comparisonRows = [
    { company: 'NVO Portfolio Management Inc.', funds: 75, size: 75.7, ret1y: 23.61, fee: 2.03, vol: 12.8 },
    { company: 'Atlas Capital Partners LLC', funds: 68, size: 64.2, ret1y: 18.45, fee: 1.87, vol: 14.1 },
    { company: 'Summit Wealth Advisors Ltd.', funds: 52, size: 48.9, ret1y: 16.20, fee: 1.65, vol: 10.7 },
    { company: 'Aurora Asset Management Co.', funds: 59, size: 57.4, ret1y: 21.02, fee: 1.92, vol: 11.9 },
  ]
  const { sorted: compSorted, sort: compSort, requestSort: compRequestSort } = useSorted(comparisonRows, 'ret1y')

  const fundBars = {
    '1W': [
      { label: 'NVO Alpha Growth', value: 2.4 },
      { label: 'NVO Tech Select', value: 2.1 },
      { label: 'NVO Flexible Bond', value: 1.8 },
      { label: 'NVO Balanced+', value: 1.5 },
      { label: 'NVO Dividend Edge', value: 1.2 },
    ],
    '1M': [
      { label: 'NVO Tech Select', value: 6.8 },
      { label: 'NVO Alpha Growth', value: 5.9 },
      { label: 'NVO Balanced+', value: 4.1 },
      { label: 'NVO Flexible Bond', value: 3.7 },
      { label: 'NVO Dividend Edge', value: 2.9 },
    ],
    'YTD': [
      { label: 'NVO Alpha Growth', value: 18.3 },
      { label: 'NVO Tech Select', value: 16.1 },
      { label: 'NVO Balanced+', value: 12.7 },
      { label: 'NVO Dividend Edge', value: 10.6 },
      { label: 'NVO Flexible Bond', value: 8.9 },
    ],
    '1Y': [
      { label: 'NVO Alpha Growth', value: 24.9 },
      { label: 'NVO Tech Select', value: 22.3 },
      { label: 'NVO Balanced+', value: 19.2 },
      { label: 'NVO Dividend Edge', value: 17.1 },
      { label: 'NVO Flexible Bond', value: 14.7 },
    ],
  }
  const [fundRange, setFundRange] = useState('1M')

  // Page 2 data (Risk Heatmap)
  const riskFunds = [
    'Atlas Portfolio Management Fund',
    'NVO Alpha Growth',
    'NVO Dividend Edge',
    'Summit Balanced Fund',
    'Aurora Tech Select',
  ]
  const riskMetrics = ['Volatility', 'Sharpe', 'Max Drawdown', 'Beta', 'VaR']
  const riskValues = riskFunds.map(() => [
    9.4 + Math.random() * 6,
    0.6 + Math.random() * 0.8,
    8 + Math.random() * 12,
    0.8 + Math.random() * 0.6,
    3 + Math.random() * 4,
  ])
  const flat = riskValues.flat()
  const minRisk = Math.min(...flat)
  const maxRisk = Math.max(...flat)
  const [hoverCell, setHoverCell] = useState(null)
  const [riskTab, setRiskTab] = useState('Risk Metrics')

  // Page 3 data (Sector Donut + Table)
  const sectors = [
    { label: 'Very Low', value: 8, color: '#22c55e' },
    { label: 'Low', value: 22, color: '#84cc16' },
    { label: 'Medium', value: 34, color: '#eab308' },
    { label: 'High', value: 24, color: '#f97316' },
    { label: 'Very High', value: 12, color: '#ef4444' },
  ]
  const sectorRows = [
    { name: 'NVO Alpha Growth', company: 'NVO', category: 'Equity', r1y: 24.9, r3y: 61.2, risk: 'High' },
    { name: 'NVO Flexible Bond', company: 'NVO', category: 'Fixed Income', r1y: 14.7, r3y: 31.4, risk: 'Medium' },
    { name: 'Atlas Balanced Core', company: 'Atlas', category: 'Balanced', r1y: 19.2, r3y: 42.5, risk: 'Medium' },
    { name: 'Aurora Tech Select', company: 'Aurora', category: 'Equity', r1y: 22.3, r3y: 57.9, risk: 'High' },
    { name: 'Summit Dividend Edge', company: 'Summit', category: 'Equity Income', r1y: 17.1, r3y: 38.2, risk: 'Low' },
  ]
  const { sorted: sectorSorted, sort: sectorSort, requestSort: sectorRequestSort } = useSorted(sectorRows, 'r1y')

  return (
    <div className="space-y-6">
      {page === 'Company Internal Comparison' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <ToggleGroup value={compareMode} onChange={setCompareMode} options={["Compare With Sector", "Compare Within Company"]} />
            </div>
            <Select value={company} onChange={setCompany} options={companies} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <MetricCard key={m.title} title={m.title} value={m.value} delta={m.delta} positive={m.positive} />
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Company Comparison</h3>
            </div>
            <table className="min-w-[720px] w-full text-sm">
              <thead>
                <tr className="text-left text-white/60">
                  {[
                    { key: 'company', label: 'Company' },
                    { key: 'funds', label: 'Number of Funds' },
                    { key: 'size', label: 'Total Size (TL) (B)' },
                    { key: 'ret1y', label: 'Avg. 1Y Return (%)' },
                    { key: 'fee', label: 'Avg. Fee (%)' },
                    { key: 'vol', label: 'Avg. Volatility' },
                  ].map((col) => (
                    <th key={col.key} className="py-2 font-normal cursor-pointer" onClick={() => compRequestSort(col.key)}>
                      <div className="inline-flex items-center gap-1">
                        {col.label}
                        {compSort.key === col.key && (
                          <span className="text-[10px] text-white/40">{compSort.dir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compSorted.map((r) => (
                  <tr key={r.company} className="border-t border-white/10">
                    <td className="py-3">{r.company}</td>
                    <td className="py-3">{r.funds}</td>
                    <td className="py-3">{r.size.toFixed(1)}B</td>
                    <td className="py-3">{r.ret1y.toFixed(2)}%</td>
                    <td className="py-3">{r.fee.toFixed(2)}%</td>
                    <td className="py-3">{r.vol.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/60">Top 5 Performing Funds</p>
                <h3 className="text-xl font-semibold">Performance by Timeframe</h3>
              </div>
              <ToggleGroup value={fundRange} onChange={setFundRange} options={["1W","1M","YTD","1Y"]} />
            </div>
            <HorizontalBarChart data={fundBars[fundRange]} unit="%" />
          </div>
        </div>
      )}

      {page === 'Fund Risk Metrics Analysis' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Comparative Investment Fund Risk Analysis</h3>
            <ToggleGroup value={riskTab} onChange={setRiskTab} options={["Risk Metrics","Correlation Analysis","Performance Attribution"]} />
          </div>

          {riskTab === 'Risk Metrics' && (
            <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-white/60">Hover a cell to see exact value</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">Low</span>
                  <div className="h-2 w-40 rounded-full" style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 25%, #eab308 60%, #ef4444 100%)' }} />
                  <span className="text-xs text-white/60">High</span>
                </div>
              </div>
              <table className="min-w-[720px] w-full text-sm">
                <thead>
                  <tr className="text-left text-white/60">
                    <th className="py-2 font-normal">Fund</th>
                    {riskMetrics.map((m) => (
                      <th key={m} className="py-2 font-normal text-center">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {riskFunds.map((f, i) => (
                    <tr key={f} className="border-t border-white/10">
                      <td className="py-2 pr-4">{f}</td>
                      {riskMetrics.map((_, j) => (
                        <HeatCell
                          key={`${i}-${j}`}
                          value={riskValues[i][j]}
                          min={minRisk}
                          max={maxRisk}
                          onHover={(v) => setHoverCell(v ? { i, j, value: riskValues[i][j] } : null)}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {hoverCell && (
                <div className="mt-3 inline-block px-3 py-1 rounded bg-black/80 text-white text-xs">
                  {riskFunds[hoverCell.i]} – {riskMetrics[hoverCell.j]}: {hoverCell.value.toFixed(2)}
                </div>
              )}
            </div>
          )}

          {riskTab === 'Correlation Analysis' && (
            <div className="p-6 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
              <p className="text-sm text-white/70">Correlation matrix visualization will appear here with interactive highlights.</p>
            </div>
          )}

          {riskTab === 'Performance Attribution' && (
            <div className="p-6 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white">
              <p className="text-sm text-white/70">Attribution breakdown by sector and factor exposures will appear here.</p>
            </div>
          )}
        </div>
      )}

      {page === 'Sector Risk Analysis' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Sector Risk Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white flex items-center gap-6">
              <DonutChart segments={sectors} />
              <div className="space-y-2">
                {sectors.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="w-28">{s.label}</span>
                    <span className="text-white">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f1320]/80 border border-white/10 text-white overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">Top Performing Funds in Sector</h4>
              </div>
              <table className="min-w-[680px] w-full text-sm">
                <thead>
                  <tr className="text-left text-white/60">
                    {[
                      { key: 'name', label: 'Fund Name' },
                      { key: 'company', label: 'Company' },
                      { key: 'category', label: 'Category' },
                      { key: 'r1y', label: '1Y Return (%)' },
                      { key: 'r3y', label: '3Y Return (%)' },
                      { key: 'risk', label: 'Risk' },
                    ].map((col) => (
                      <th key={col.key} className="py-2 font-normal cursor-pointer" onClick={() => sectorRequestSort(col.key)}>
                        <div className="inline-flex items-center gap-1">
                          {col.label}
                          {sectorSort.key === col.key && (
                            <span className="text-[10px] text-white/40">{sectorSort.dir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sectorSorted.map((r) => (
                    <tr key={r.name} className="border-t border-white/10">
                      <td className="py-3">{r.name}</td>
                      <td className="py-3">{r.company}</td>
                      <td className="py-3 text-white/70">{r.category}</td>
                      <td className="py-3">{r.r1y.toFixed(1)}%</td>
                      <td className="py-3">{r.r3y.toFixed(1)}%</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded text-xs border border-white/10 bg-white/5">{r.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
