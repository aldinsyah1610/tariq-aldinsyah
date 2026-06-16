import { lazy, Suspense } from 'react'

const AboutSankey = lazy(() => import('./AboutSankey'))

export default function ProcessBreakdown() {
  return (
    <section id="process" className="relative py-32 overflow-hidden" style={{ background: 'var(--card)' }}>
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="flex flex-wrap gap-10 mb-16 pb-8 border-b border-[#1e2a0a]">
          <div>
            <p className="label-tag mb-3">Design Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text)' }}>How I Work</h2>
          </div>
          <div className="ml-auto max-w-lg flex items-end">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-40)' }}>
              A breakdown of how I allocate design effort across research, UX strategy,
              and UI execution — based on real project hours.
            </p>
          </div>
        </div>

        {/* Sankey at full container width — labels render ~2× larger than half-column placement */}
        <Suspense fallback={
          <div className="rounded-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)', height: 420 }} />
        }>
          <AboutSankey />
        </Suspense>
      </div>
    </section>
  )
}
