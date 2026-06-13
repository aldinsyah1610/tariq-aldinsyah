import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Layout constants ───────────────────────────────────────────────────────
const H       = 500
const SRC_W   = 100                    // source block width
const CAT_X   = 230, CAT_W = 82       // category blocks
const SUB_X   = 432, SUB_W = 74       // sub-item blocks
const LBL_X   = SUB_X + SUB_W + 14   // label start x
const SVG_W   = 800
const GAP_CAT = 14                    // gap between category blocks
const GAP_SUB = 6                     // gap between sub blocks
const MX1     = (SRC_W + CAT_X) / 2  // bezier midpoint stage 1
const MX2     = (CAT_X + CAT_W + SUB_X) / 2  // bezier midpoint stage 2

// ─── Per-category colors ────────────────────────────────────────────────────
const COL = {
  research: { fill: 'rgba(192,245,61,0.09)', stroke: 'rgba(192,245,61,0.30)', flow: 'rgba(192,245,61,0.06)', txt: '#C0F53D' },
  ux:       { fill: 'rgba(155,220,55,0.09)', stroke: 'rgba(155,220,55,0.25)', flow: 'rgba(155,220,55,0.06)', txt: '#9bdc37' },
  ui:       { fill: 'rgba(108,175,50,0.09)', stroke: 'rgba(108,175,50,0.22)', flow: 'rgba(108,175,50,0.06)', txt: '#6caf32' },
}

// ─── Data ───────────────────────────────────────────────────────────────────
const DEFS = [
  {
    id: 'research', pct: 0.60, label: 'Research', pctLabel: '60%',
    subs: [
      { name: 'Brand Identity',             pct: 0.10, pctLabel: '10%' },
      { name: 'Business Analysis',          pct: 0.15, pctLabel: '15%' },
      { name: 'Field Survey & Observation', pct: 0.05, pctLabel: '5%'  },
      { name: 'Concept Ideation',           pct: 0.10, pctLabel: '10%' },
      { name: 'Research Journals',          pct: 0.10, pctLabel: '10%' },
      { name: 'Design Style Research',      pct: 0.10, pctLabel: '10%' },
    ],
  },
  {
    id: 'ux', pct: 0.10, label: 'UX Research', pctLabel: '10%',
    subs: [
      { name: 'User Interviews',       pct: 0.05, pctLabel: '5%' },
      { name: 'User Flow & Wireframe', pct: 0.05, pctLabel: '5%' },
    ],
  },
  {
    id: 'ui', pct: 0.30, label: 'UI Design', pctLabel: '30%',
    subs: [
      { name: 'Visual Design',     pct: 0.05, pctLabel: '5%'  },
      { name: 'Design System',     pct: 0.10, pctLabel: '10%' },
      { name: 'Hi-Fi Prototype',   pct: 0.10, pctLabel: '10%' },
      { name: 'Developer Handoff', pct: 0.05, pctLabel: '5%'  },
    ],
  },
]

// ─── Compute layout positions ────────────────────────────────────────────────
function buildLayout() {
  const catEffH = H - (DEFS.length - 1) * GAP_CAT
  let srcY = 0, catY = 0

  return DEFS.map(f => {
    const srcH = H * f.pct
    const catH = catEffH * f.pct
    const subEffH = catH - (f.subs.length - 1) * GAP_SUB
    let catRelY = 0, subY = catY

    const subs = f.subs.map(s => {
      const ratio     = s.pct / f.pct
      const catSideH  = catH * ratio       // height at cat-block edge (no gap)
      const subH      = subEffH * ratio    // height of sub block (with gaps removed)
      const item = {
        ...s,
        catSideY0: catY + catRelY, catSideH,
        subY0: subY, subH,
      }
      catRelY += catSideH
      subY    += subH + GAP_SUB
      return item
    })

    const flow = { ...f, col: COL[f.id], srcY0: srcY, srcH, catY0: catY, catH, subs }
    srcY += srcH
    catY += catH + GAP_CAT
    return flow
  })
}

const LAYOUT = buildLayout()

// ─── Path builders ──────────────────────────────────────────────────────────
const stage1 = f =>
  `M${SRC_W} ${f.srcY0}C${MX1} ${f.srcY0} ${MX1} ${f.catY0} ${CAT_X} ${f.catY0}` +
  `L${CAT_X} ${f.catY0+f.catH}C${MX1} ${f.catY0+f.catH} ${MX1} ${f.srcY0+f.srcH} ${SRC_W} ${f.srcY0+f.srcH}Z`

const stage2 = s =>
  `M${CAT_X+CAT_W} ${s.catSideY0}C${MX2} ${s.catSideY0} ${MX2} ${s.subY0} ${SUB_X} ${s.subY0}` +
  `L${SUB_X} ${s.subY0+s.subH}C${MX2} ${s.subY0+s.subH} ${MX2} ${s.catSideY0+s.catSideH} ${CAT_X+CAT_W} ${s.catSideY0+s.catSideH}Z`

// ─── Component ──────────────────────────────────────────────────────────────
export default function AboutSankey() {
  const svgRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const st  = { trigger: el, start: 'top 82%' }
      const sel = cls => el.querySelectorAll(cls)

      gsap.fromTo(sel('.p1'),    { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.2,  ease: 'power2.out',               scrollTrigger: st })
      gsap.fromTo(sel('.catb'),  { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.2,  ease: 'power3.out', delay: 0.3,  scrollTrigger: st })
      gsap.fromTo(sel('.p2'),    { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out',               delay: 0.48, scrollTrigger: st })
      gsap.fromTo(sel('.subb'),  { opacity: 0, x: 8  }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out', delay: 0.65, scrollTrigger: st })
      gsap.fromTo(sel('.lbl'),   { opacity: 0, x: 5  }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out',delay: 0.82, scrollTrigger: st })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div className="rounded-2xl p-6 pb-8" style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>
      <div className="flex items-center justify-between mb-5">
        <p className="label-tag">Design Process Breakdown</p>
        <p className="text-white/20 text-xs">Based on total working hours</p>
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${H + 18}`}
        className="w-full" style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}>

        {/* ── Source block ── */}
        <rect x={0} y={0} width={SRC_W} height={H}
          fill="rgba(192,245,61,0.08)" stroke="rgba(192,245,61,0.32)"
          strokeWidth={1.5} rx={7} />
        {LAYOUT.slice(0, -1).map(f => (
          <line key={f.id + 's'}
            x1={5} y1={f.srcY0 + f.srcH}
            x2={SRC_W - 5} y2={f.srcY0 + f.srcH}
            stroke="rgba(192,245,61,0.16)" strokeWidth={1} />
        ))}
        <text x={SRC_W / 2} y={H / 2 - 9}  textAnchor="middle" fill="#C0F53D" fontSize={9.5} fontWeight={700} letterSpacing="0.1em">DESIGN</text>
        <text x={SRC_W / 2} y={H / 2 + 9}  textAnchor="middle" fill="#C0F53D" fontSize={9.5} fontWeight={700} letterSpacing="0.1em">PROCESS</text>

        {LAYOUT.map(f => (
          <g key={f.id}>
            {/* Stage 1: source → category */}
            <path className="p1" d={stage1(f)}
              fill={f.col.flow} stroke={f.col.stroke} strokeWidth={0.4} opacity={0} />

            {/* Category block */}
            <rect className="catb"
              x={CAT_X} y={f.catY0} width={CAT_W} height={f.catH}
              fill={f.col.fill} stroke={f.col.stroke} strokeWidth={1} rx={5} opacity={0} />
            <text className="catb" x={CAT_X + CAT_W / 2} y={f.catY0 + f.catH / 2 - 8}
              textAnchor="middle" fill={f.col.txt} fontSize={10} fontWeight={700} opacity={0}>
              {f.pctLabel}
            </text>
            <text className="catb" x={CAT_X + CAT_W / 2} y={f.catY0 + f.catH / 2 + 7}
              textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={8.5} fontWeight={600} opacity={0}>
              {f.label}
            </text>

            {/* Stage 2: category → sub items */}
            {f.subs.map(s => (
              <g key={s.name}>
                <path className="p2" d={stage2(s)}
                  fill={f.col.flow} stroke={f.col.stroke} strokeWidth={0.3} opacity={0} />
                <rect className="subb"
                  x={SUB_X} y={s.subY0} width={SUB_W} height={s.subH}
                  fill={f.col.fill} stroke={f.col.stroke} strokeWidth={1} rx={4} opacity={0} />
                <text className="lbl"
                  x={LBL_X} y={s.subY0 + s.subH / 2}
                  dominantBaseline="middle" opacity={0}>
                  <tspan fill={f.col.txt} fontSize={9} fontWeight={700}>{s.pctLabel} </tspan>
                  <tspan fill="rgba(255,255,255,0.45)" fontSize={9}>{s.name}</tspan>
                </text>
              </g>
            ))}
          </g>
        ))}

        <text x={SVG_W / 2} y={H + 16} textAnchor="middle"
          fill="rgba(255,255,255,0.1)" fontSize={8} letterSpacing="0.14em">
          TARIQ ALDINSYAH — DESIGN WORKFLOW
        </text>
      </svg>
    </div>
  )
}
