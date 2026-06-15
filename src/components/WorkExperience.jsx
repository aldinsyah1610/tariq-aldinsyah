import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Search, Box, FileText } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { raw: 40, fmt: v => `${v}%`, label: 'development efficiency gain' },
  { raw: 20, fmt: v => `${v}%`, label: 'growth in active users' },
  { raw: 50, fmt: v => `${v}+`, label: 'cooperatives integrated' },
  { raw: 1,  fmt: v => `#${v}`, label: 'innovation award 2024' },
]

const FEATURED = [
  {
    name: 'Rakit Ecosystem',
    tag: 'Platform',
    impact: '1st Place · Kisel Innovation Award 2024',
    desc: 'Modular digital development system — e-commerce, cooperative, and POS modules. 40% improvement in development efficiency.',
    award: true,
  },
  {
    name: 'MyKisel',
    tag: 'Mobile App',
    impact: '20% growth in active users within 3 months',
    desc: 'Full UI/UX redesign of Telkomsel Cooperative member app. New E-Cafeteria and peer-to-peer transfer features.',
    award: false,
  },
  {
    name: 'CoopIn',
    tag: 'Ecosystem',
    impact: '50+ cooperatives integrated',
    desc: 'Digital cooperative ecosystem (web + mobile) for savings, loans, membership, and financial management.',
    award: false,
  },
]

const ALSO = [
  { name: 'BayarAja POS',           tag: 'Fintech'    },
  { name: 'Marissa HRIS',           tag: 'HR'         },
  { name: 'Dira Help Desk',         tag: 'Enterprise' },
  { name: 'BayarAja & Sales Force', tag: 'Payment'    },
  { name: 'SIAK',                   tag: 'Healthcare' },
  { name: 'Piranti & iFMC',         tag: 'HRIS'       },
  { name: 'Simusi',                 tag: 'E-Commerce' },
]

const AKI_CARDS = [
  { Icon: Search,   label: 'Field Research',   sub: 'Route mapping, load calc, range estimation & DRnO documentation' },
  { Icon: Box,      label: 'Fusion 360',        sub: 'Concept sketches and final 3D modelling of MLBP unit' },
  { Icon: FileText, label: 'Tech Drawings',     sub: 'Production-ready technical drawings for prototyping teams' },
]

export default function WorkExperience() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const kiselRef   = useRef(null)
  const statRefs   = useRef([])
  const cardRefs   = useRef([])
  const pillRefs   = useRef([])
  const akiRef     = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) return

      gsap.fromTo(
        headerRef.current?.querySelector('h2'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      gsap.fromTo(kiselRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: kiselRef.current, start: 'top 84%' } }
      )

      const countST = { trigger: kiselRef.current, start: 'top 72%', once: true }
      statRefs.current.forEach((el, i) => {
        if (!el) return
        const numEl = el.querySelector('[data-num]')
        if (!numEl) return
        const s = STATS[i]
        gsap.set(numEl, { opacity: 0 })
        const obj = { val: 0 }
        gsap.to(numEl, { opacity: 1, duration: 0.3, delay: i * 0.08, scrollTrigger: countST })
        gsap.to(obj, {
          val: s.raw, duration: 1.4, ease: 'power2.out', delay: i * 0.1,
          onUpdate: () => { numEl.textContent = s.fmt(Math.round(obj.val)) },
          scrollTrigger: countST,
        })
      })

      gsap.fromTo(cardRefs.current.filter(Boolean),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: kiselRef.current, start: 'top 62%' } }
      )

      gsap.fromTo(pillRefs.current.filter(Boolean),
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out', stagger: 0.04,
          scrollTrigger: { trigger: kiselRef.current, start: 'top 48%' } }
      )

      gsap.fromTo(akiRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: akiRef.current, start: 'top 84%' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[600px] h-[600px] top-[-100px] right-[-150px] opacity-10" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section heading */}
        <div ref={headerRef} className="mb-16">
          <h2 className="font-black leading-[1.0] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">Work </span>
            <span className="font-serif italic font-semibold text-lime">Experience</span>
          </h2>
        </div>

        <div className="space-y-5">

          {/* ── Kisel Group ── */}
          <div ref={kiselRef} className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

            {/* Company header */}
            <div className="p-5 sm:p-10" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-black tracking-tight leading-none mb-2"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                    Kisel Group
                  </h3>
                  <p className="font-semibold text-sm tracking-wide mb-1.5"
                    style={{ color: 'var(--lime-text)' }}>
                    UI/UX Product Designer
                  </p>
                  <p className="text-xs flex items-center gap-1.5"
                    style={{ color: 'var(--text-30)' }}>
                    <MapPin size={10} /> Jakarta Selatan
                  </p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                  <p className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-50)' }}>
                    Aug 2024 – Present
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase"
                    style={{ background: 'rgba(192,245,61,0.08)', color: 'var(--lime-text)', border: '1px solid rgba(192,245,61,0.18)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: 'var(--lime-text)' }} />
                    Current
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4"
              style={{ borderBottom: '1px solid var(--border)' }}>
              {STATS.map((s, i) => (
                <div key={s.label}
                  ref={el => statRefs.current[i] = el}
                  className={[
                    'p-4 sm:p-8',
                    i === 0 ? 'border-r border-b sm:border-b-0 border-[#1e2a0a]' : '',
                    i === 1 ? 'border-b sm:border-b-0 sm:border-r border-[#1e2a0a]' : '',
                    i === 2 ? 'border-r border-[#1e2a0a]' : '',
                  ].join(' ')}>
                  <p data-num className="font-black tabular-nums leading-none mb-2"
                    style={{
                      fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                      color: i === 3 ? 'var(--lime-text)' : 'var(--text)',
                    }}>
                    {s.fmt(s.raw)}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: 'var(--text-35)' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Featured projects */}
            <div className="p-5 sm:p-10">
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {FEATURED.map((p, i) => (
                  <div key={p.name}
                    ref={el => cardRefs.current[i] = el}
                    className="rounded-xl p-5 group transition-colors"
                    style={{
                      background: 'var(--medium)',
                      border: p.award ? '1px solid rgba(192,245,61,0.28)' : '1px solid var(--border)',
                      boxShadow: p.award ? '0 0 32px rgba(192,245,61,0.06)' : 'none',
                    }}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase"
                        style={{ color: 'var(--lime-text)', opacity: 0.65 }}>
                        {p.tag}
                      </span>
                      {p.award && (
                        <span className="text-[0.58rem] font-black tracking-widest uppercase rounded-full px-2 py-0.5 leading-none"
                          style={{ background: 'rgba(192,245,61,0.1)', color: 'var(--lime-text)' }}>
                          ✦ Award
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-lime transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-35)' }}>
                      {p.desc}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--lime-text)', opacity: 0.75 }}>
                      {p.impact}
                    </p>
                  </div>
                ))}
              </div>

              {/* Also designed */}
              <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <span className="text-xs tracking-widest uppercase flex-shrink-0"
                    style={{ color: 'var(--text-25)' }}>
                    Also designed
                  </span>
                  {ALSO.map((p, i) => (
                    <span key={p.name} ref={el => pillRefs.current[i] = el}
                      className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-50)' }}>{p.name}</span>
                      <span className="text-[0.55rem] uppercase tracking-wider font-medium"
                        style={{ color: 'var(--text-25)' }}>{p.tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── PT Akurasi Konstruksi Indonesia ── */}
          <div ref={akiRef} className="rounded-2xl p-5 sm:p-10"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="grid sm:grid-cols-[2fr_3fr] gap-8 sm:gap-12">

              {/* Left: company info */}
              <div>
                <h3 className="text-white font-bold leading-snug mb-2"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
                  PT Akurasi Konstruksi Indonesia
                </h3>
                <p className="text-sm font-semibold mb-1.5"
                  style={{ color: 'var(--lime-text)', opacity: 0.8 }}>
                  Product Designer Intern
                </p>
                <p className="text-xs flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-30)' }}>
                  <MapPin size={10} /> Bandung
                </p>
                <p className="text-xs" style={{ color: 'var(--text-30)' }}>Aug – Oct 2023</p>
              </div>

              {/* Right: project + highlights */}
              <div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-60)' }}>
                  Mobile Lithium Backup Power{' '}
                  <span style={{ color: 'var(--text-30)' }}>(MLBP)</span>
                  {' '}— led industrial design of a portable power unit to replace traditional generators in telecom infrastructure maintenance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {AKI_CARDS.map(({ Icon, label, sub }) => (
                    <div key={label} className="rounded-xl p-4"
                      style={{ background: 'var(--medium)', border: '1px solid var(--border)' }}>
                      <Icon size={14} className="mb-2.5" style={{ color: 'var(--lime-text)', opacity: 0.55 }} />
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-70)' }}>{label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-30)' }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
