import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects'
import CountUp from './CountUp'

gsap.registerPlugin(ScrollTrigger)

const DOMAIN_MAP = {
  'bayaraja':           'Fintech & Payments',
  'bayaraja-pos':       'Fintech & Payments',
  'bayaraja-canvasser': 'Fintech & Payments',
  'coopin-ecosystem':   'Cooperative Systems',
  'mykisel-redesign':   'Cooperative Systems',
  'marissa-hris':       'HR & Workforce',
  'ifmc':               'HR & Workforce',
  'dira-helpdesk':      'Enterprise & Ops',
  'selynar-oms':        'Enterprise & Ops',
  'nexus-care':         'Healthcare',
  'rakit-ecosystem':    'Design Systems',
}

// Color tokens: cycle --viz-1/2/3, second group dimmed to differentiate
const DOMAIN_META = [
  { label: 'Fintech & Payments',  color: 'var(--viz-1)', opacity: 1.0  },
  { label: 'Cooperative Systems', color: 'var(--viz-2)', opacity: 1.0  },
  { label: 'HR & Workforce',      color: 'var(--viz-3)', opacity: 1.0  },
  { label: 'Enterprise & Ops',    color: 'var(--viz-1)', opacity: 0.6  },
  { label: 'Healthcare',          color: 'var(--viz-2)', opacity: 0.6  },
  { label: 'Design Systems',      color: 'var(--viz-3)', opacity: 0.6  },
]

// Derive counts from real project data
const counts = {}
projects.forEach(p => {
  const domain = DOMAIN_MAP[p.id]
  if (domain) counts[domain] = (counts[domain] || 0) + 1
})

const DOMAINS = DOMAIN_META.map(d => ({ ...d, count: counts[d.label] || 0 }))
const MAX = Math.max(...DOMAINS.map(d => d.count))

export default function DomainBreakdown() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      gsap.from(el.querySelectorAll('.db-bar'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.65,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="rounded-2xl p-7 flex flex-col flex-1"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="label-tag mb-6">Domains I've Designed Across</p>
      <div className="flex flex-col justify-between flex-1 gap-3">
        {DOMAINS.map((d) => {
          const pct = Math.round((d.count / MAX) * 100)
          return (
            <div key={d.label}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-50)' }}>
                  {d.label}
                </span>
                <CountUp
                  value={String(d.count)}
                  className="text-sm font-bold tabular-nums"
                  style={{ color: d.color, opacity: d.opacity }}
                />
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'var(--border)' }}>
                <div
                  className="db-bar h-full rounded-full"
                  style={{ width: `${pct}%`, background: d.color, opacity: d.opacity }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
