import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords, splitChars } from '../utils/splitText'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

const VW     = 560
const VH     = 520
const CX     = 280
const CY     = 260
const R      = 145
const LR     = 192   // label radius
const LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0]
const N      = 6
const ANGLES = Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI - Math.PI / 2)

// Clockwise from top: top, upper-right, lower-right, bottom, lower-left, upper-left
const SKILLS = [
  { label: 'UX Research',      value: 82, desc: 'User interviews, usability tests & research synthesis' },
  { label: 'Visual Design',    value: 85, desc: 'Typography, colour, layout & visual hierarchy' },
  { label: 'Prototyping',      value: 88, desc: 'Hi-fi Figma flows, interaction models & micro-UX' },
  { label: 'Design Systems',   value: 82, desc: 'Component libraries, tokens & scalable pattern systems' },
  { label: 'Collaboration',    value: 90, desc: 'Stakeholder management, cross-functional & design handoff' },
  { label: 'Product Strategy', value: 85, desc: 'Roadmap alignment, business context & product thinking' },
]

function anchor(angle) {
  const c = Math.cos(angle)
  if (c > 0.3) return 'start'
  if (c < -0.3) return 'end'
  return 'middle'
}

export default function SkillRadar() {
  const { theme } = useTheme()
  const lr = (a) => theme === 'light' ? `rgba(92,138,0,${a})` : `rgba(192,245,61,${a})`

  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)
  const polygonRef = useRef(null)
  const dotsRef    = useRef([])
  const cardsRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const st = { trigger: sectionRef.current, start: 'top 76%' }

      const h2 = headerRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: st })
        gsap.from(chars, { y: '105%', stagger: 0.055, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: st })
      }

      if (gridRef.current)
        gsap.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out', scrollTrigger: st })

      if (polygonRef.current)
        gsap.fromTo(polygonRef.current,
          { scale: 0 },
          { scale: 1, svgOrigin: `${CX} ${CY}`, duration: 1.4, ease: 'power3.out', delay: 0.15, scrollTrigger: st })

      dotsRef.current.forEach((el, i) => {
        if (!el) return
        const a = ANGLES[i]
        const r = (SKILLS[i].value / 100) * R
        gsap.fromTo(el,
          { scale: 0 },
          { scale: 1, svgOrigin: `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`,
            duration: 0.45, ease: 'back.out(2)', delay: 0.7 + i * 0.07, scrollTrigger: st })
      })

      const cards = cardsRef.current?.children
      if (cards?.length)
        gsap.fromTo(cards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.25, scrollTrigger: st })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const pts = SKILLS.map((s, i) => {
    const a = ANGLES[i]
    const r = (s.value / 100) * R
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
  })
  const polyPts = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

  return (
    <section id="skill-radar" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[500px] h-[500px] top-[-80px] right-[-80px] opacity-15" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        <div ref={headerRef} className="mb-16">
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">Competency </span>
            <span className="font-serif italic font-semibold text-lime">Radar</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-35)' }}>
            Core skill dimensions for a product UI/UX designer — rated against real project output.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_500px] gap-10 lg:gap-16 items-center">

          {/* Skill cards */}
          <div ref={cardsRef} className="grid sm:grid-cols-2 gap-4">
            {SKILLS.map((s) => (
              <div key={s.label} className="rounded-xl p-5"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--lime-text)' }}>
                    {s.label}
                  </p>
                  <span className="text-lg font-black text-white tabular-nums leading-none">
                    {s.value}<span className="text-xs font-normal text-white/30">%</span>
                  </span>
                </div>
                <div className="h-[2px] rounded-full mb-3" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: 'var(--lime-text)' }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-35)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Radar SVG */}
          <div className="flex items-center justify-center">
            <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ maxWidth: 500, overflow: 'visible' }}
              role="img" aria-label="Hexagonal competency radar chart">

              {/* Grid */}
              <g ref={gridRef}>
                {LEVELS.map((lv) => {
                  const hexPts = ANGLES.map(a =>
                    `${(CX + lv * R * Math.cos(a)).toFixed(2)},${(CY + lv * R * Math.sin(a)).toFixed(2)}`
                  ).join(' ')
                  return (
                    <polygon key={lv} points={hexPts} fill="none"
                      stroke={lr(lv === 1 ? 0.28 : 0.13)} strokeWidth="1" />
                  )
                })}

                {/* Axis lines */}
                {ANGLES.map((a, i) => (
                  <line key={i}
                    x1={CX} y1={CY}
                    x2={(CX + R * Math.cos(a)).toFixed(2)}
                    y2={(CY + R * Math.sin(a)).toFixed(2)}
                    stroke={lr(0.2)} strokeWidth="1" />
                ))}

                {/* Level ticks on vertical axis */}
                {LEVELS.map((lv) => (
                  <text key={lv}
                    x={(CX + 5).toFixed(2)}
                    y={(CY - lv * R - 3).toFixed(2)}
                    fill={lr(0.45)} fontSize="9"
                    fontFamily="'Space Grotesk', sans-serif">
                    {Math.round(lv * 100)}%
                  </text>
                ))}
              </g>

              {/* Data polygon */}
              <polygon ref={polygonRef}
                points={polyPts}
                fill={lr(0.10)}
                stroke={lr(0.82)}
                strokeWidth="1.5"
                strokeLinejoin="round" />

              {/* Dots */}
              {pts.map(([x, y], i) => (
                <g key={i} ref={el => { dotsRef.current[i] = el }}>
                  <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="8"
                    fill="none" stroke={lr(0.35)} strokeWidth="1.5" />
                  <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="3.5"
                    fill={lr(1)} />
                </g>
              ))}

              {/* Axis labels */}
              {SKILLS.map((s, i) => {
                const a  = ANGLES[i]
                const lx = (CX + LR * Math.cos(a)).toFixed(2)
                const ly = (CY + LR * Math.sin(a)).toFixed(2)
                const ta = anchor(a)
                return (
                  <g key={i} transform={`translate(${lx},${ly})`}>
                    <text y="-6" textAnchor={ta}
                      fill="white" fillOpacity="0.82" fontSize="11" fontWeight="700"
                      fontFamily="'Space Grotesk', sans-serif">
                      {s.label}
                    </text>
                    <text y="8" textAnchor={ta}
                      fill={lr(0.85)} fontSize="9.5"
                      fontFamily="'Space Grotesk', sans-serif">
                      {s.value}%
                    </text>
                  </g>
                )
              })}

            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
