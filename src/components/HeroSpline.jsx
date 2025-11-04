import Spline from '@splinetool/react-spline'

export default function HeroSpline() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1320] to-[#0a0d14]">
      <div className="h-[280px] sm:h-[340px] md:h-[400px]">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_300px_at_10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(600px_200px_at_90%_120%,rgba(168,85,247,0.2),transparent)]" />
      <div className="absolute inset-0 flex items-end">
        <div className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-white/70">Premium Credit Insights</p>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white">Real-time Spend Analysis</h2>
        </div>
      </div>
    </div>
  )
}
