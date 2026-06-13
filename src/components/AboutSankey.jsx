import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const H     = 400
const LX    = 110
const RX    = 530
const RW    = 115
const GAP   = 20
const MX    = (LX + RX) / 2
const SVG_W = 880
const LBL_X = RX + RW + 18

const LIME        = '#C0F53D'
const FILL_BLOCK  = 'rgba(192,245,61,0.08)'
const STROKE_L    = 'rgba(192,245,61,0.38)'  // left block border
const STROKE_R    = 'rgba(192,245,61,0.22)'  // right block border
const FLOW_FILL   = 'rgba(192,245,61,0.07)'

const FLOWS = [
  {
    pct: 0.60, pctLabel: '60%', label: 'Research',
    sub: [
      { pct: '10%', name: 'Brand Identity' },
      { pct: '15%', name: 'Business Analysis' },
      { pct: '5%',  name: 'Field Survey & Observation' },
      { pct: '10%', name: 'Concept Ideation' },
      { pct: '10%', name: 'Research Journals' },
      { pct: '10%', name: 'Design Style Research' },
    ],
  },
  {
    pct: 0.10, pctLabel: '10%', label: 'UX Research',
    sub: [
      { pct: '5%', name: 'User Interviews' },
      { pct: '5%', name: 'User Flow & Wireframe' },
    ],
  },
  {
    pct: 0.30, pctLabel: '30%', label: 'UI Design',
    sub: [
      { pct: '5%',  name: 'Visual Design' },
      { pct: '10%', name: 'Design System' },
      { pct: '10%', name: 'Hi-Fi Prototype' },
      { pct: '5%',  name: 'Developer Handoff' },
    ],
  },
]

// Pre-compute positions (module-level, runs once)
const totalGap = (FLOWS.length - 1) * GAP
let lY = 0, rY = 0
const computed = FLOWS.map(f => {
  const lH = H * f.pct
  const rH = (H - totalGap) * f.pct
  const c = { ...f, lY0: lY, lH, rY0: rY, rH }
  lY += lH
  rY += rH + GAP
  return c
})

function flowPath({ lY0, lH, rY0, rH }) {
  return [
    `M ${LX} ${lY0}`,
    `C ${MX} ${lY0} ${MX} ${rY0} ${RX} ${rY0}`,
    `L ${RX} ${rY0 + rH}`,
    `C ${MX} ${rY0 + rH} ${MX} ${lY0 + lH} ${LX} ${lY0 + lH}`,
    'Z',
  ].join(' ')
}

export default function AboutSankey() {
  const svgRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: 'top 82%' }
      gsap.fromTo(el.querySelectorAll('.s-path'),
        { opacity: 0 },
        { opacity: 1, duration: 0.9, stagger: 0.2, ease: 'power2.out', scrollTrigger: st })
      gsap.fromTo(el.querySelectorAll('.s-block'),
        { opacity: 0, x: 14 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out', delay: 0.35, scrollTrigger: st })
      gsap.fromTo(el.querySelectorAll('.s-lbl'),
        { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', delay: 0.5, scrollTrigger: st })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div className="rounded-2xl p-6 pb-8" style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>
      <div className="flex items-center justify-between mb-5">
        <p className="label-tag">Design Process Breakdown</p>
        <p className="text-white/20 text-xs">Based on total working hours</p>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${H + 10}`}
        className="w-full"
        style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {/* Left source block */}
        <rect
          x={0} y={0} width={LX} height={H}
          fill={FILL_BLOCK} stroke={STROKE_L} strokeWidth={1.5} rx={7}
        />
        {/* Separator lines between flows on left block */}
        {computed.slice(0, -1).map(f => (
          <line key={f.label + '-sep'}
            x1={4} y1={f.lY0 + f.lH}
            x2={LX - 4} y2={f.lY0 + f.lH}
            stroke="rgba(192,245,61,0.2)" strokeWidth={1} />
        ))}
        <text x={LX / 2} y={H / 2 - 9} textAnchor="middle" fill={LIME} fontSize={10} fontWeight={700} letterSpacing="0.1em">DESIGN</text>
        <text x={LX / 2} y={H / 2 + 9} textAnchor="middle" fill={LIME} fontSize={10} fontWeight={700} letterSpacing="0.1em">PROCESS</text>

        {/* Flow paths */}
        {computed.map(f => (
          <path key={f.label} className="s-path"
            d={flowPath(f)}
            fill={FLOW_FILL}
            stroke="rgba(192,245,61,0.12)" strokeWidth={0.5}
            opacity={0}
          />
        ))}

        {/* Right blocks + labels */}
        {computed.map(f => {
          const midY = f.rY0 + f.rH / 2
          return (
            <g key={f.label + '-r'}>
              {/* Right block */}
              <rect className="s-block"
                x={RX} y={f.rY0} width={RW} height={f.rH}
                fill={FILL_BLOCK} stroke={STROKE_R} strokeWidth={1} rx={5}
              />

              {/* Main percentage */}
              <text className="s-lbl"
                x={LBL_X} y={midY - 17}
                fill={LIME} fontSize={18} fontWeight={800}
                dominantBaseline="middle">
                {f.pctLabel}
              </text>

              {/* Category name */}
              <text className="s-lbl"
                x={LBL_X} y={midY + 1}
                fill="white" fontSize={11} fontWeight={700}
                dominantBaseline="middle">
                {f.label}
              </text>

              {/* Sub-items with individual percentages */}
              {f.sub.map((s, i) => (
                <text key={s.name} className="s-lbl"
                  x={LBL_X} y={midY + 17 + i * 13}
                  dominantBaseline="middle">
                  <tspan fill={LIME} fontSize={9} fontWeight={600} opacity={0.7}>{s.pct} </tspan>
                  <tspan fill="rgba(255,255,255,0.33)" fontSize={9}>{s.name}</tspan>
                </text>
              ))}
            </g>
          )
        })}

        {/* Bottom caption */}
        <text x={SVG_W / 2} y={H + 26}
          textAnchor="middle"
          fill="rgba(255,255,255,0.12)" fontSize={8.5} letterSpacing="0.14em">
          TARIQ ALDINSYAH — DESIGN WORKFLOW
        </text>
      </svg>
    </div>
  )
}
