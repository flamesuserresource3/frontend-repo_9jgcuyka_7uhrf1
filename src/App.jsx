import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import HeroSpline from './components/HeroSpline'
import DashboardContent from './components/DashboardContent'

function App() {
  const [page, setPage] = useState('Company Internal Comparison')

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="flex">
        <Sidebar currentPage={page} onSelect={setPage} />
        <div className="flex-1 min-w-0">
          <Header />
          <main className="p-4 md:p-6 space-y-6">
            <HeroSpline />
            <DashboardContent page={page} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
