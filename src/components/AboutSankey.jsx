import { useMemo, useRef, useEffect } from 'react'
import { sankey as createSankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Dimensions ─────────────────────────────────────────────────────────────
const CW = 480   // chart width
const CH = 520   // chart height
const NW = 18    // node width
const NP = 10    // node padding between blocks

// ── Nodes ──────────────────────────────────────────────────────────────────
const RAW_NODES = [
  { id: 0,  cat: 'src',      name: 'Design Process' },
  { id: 1,  cat: 'research', name: 'Research',                   pct: '60%' },
  { id: 2,  cat: 'ux',       name: 'UX Research',                pct: '10%' },
  { id: 3,  cat: 'ui',       name: 'UI Design',                  pct: '30%' },
  { id: 4,  cat: 'research', name: 'Brand Identity',             pct: '10%' },
  { id: 5,  cat: 'research', name: 'Business Analysis',          pct: '15%' },
  { id: 6,  cat: 'research', name: 'Field Survey & Observation', pct: '5%'  },
  { id: 7,  cat: 'research', name: 'Concept Ideation',           pct: '10%' },
  { id: 8,  cat: 'research', name: 'Research Journals',          pct: '10%' },
  { id: 9,  cat: 'research', name: 'Design Style Research',      pct: '10%' },
  { id: 10, cat: 'ux',       name: 'User Interviews',            pct: '5%'  },
  { id: 11, cat: 'ux',       name: 'User Flow & Wireframe',      pct: '5%'  },
  { id: 12, cat: 'ui',       name: 'Visual Design',              pct: '5%'  },
  { id: 13, cat: 'ui',       name: 'Design System',              pct: '10%' },
  { id: 14, cat: 'ui',       name: 'Hi-Fi Prototype',            pct: '10%' },
  { id: 15, cat: 'ui',       name: 'Developer Handoff',          pct: '5%'  },
]

// ── Links ──────────────────────────────────────────────────────────────────
const RAW_LINKS = [
  { source: 0, target: 1,  value: 60 },
  { source: 0, target: 2,  value: 10 },
  { source: 0, target: 3,  value: 30 },
  { source: 1, target: 4,  value: 10 },
  { source: 1, target: 5,  value: 15 },
  { source: 1, target: 6,  value:  5 },
  { source: 1, target: 7,  value: 10 },
  { source: 1, target: 8,  value: 10 },
  { source: 1, target: 9,  value: 10 },
  { source: 2, target: 10, value:  5 },
  { source: 2, target: 11, value:  5 },
  { source: 3, target: 12, value:  5 },
  { source: 3, target: 13, value: 10 },
  { source: 3, target: 14, value: 10 },
  { source: 3, target: 15, value:  5 },
]

// ── Colors (lime palette, transparent style) ───────────────────────────────
const C = {
  src:      { node: 'rgba(192,245,61,0.10)', stroke: 'rgba(192,245,61,0.40)', link: 'rgba(192,245,61,0.22)', txt: '#C0F53D' },
  research: { node: 'rgba(192,245,61,0.08)', stroke: 'rgba(192,245,61,0.32)', link: 'rgba(192,245,61,0.22)', txt: '#C0F53D' },
  ux:       { node: 'rgba(150,212,55,0.08)', stroke: 'rgba(150,212,55,0.28)', link: 'rgba(150,212,55,0.18)', txt: '#96d437' },
  ui:       { node: 'rgba(104,165,42,0.08)', stroke: 'rgba(104,165,42,0.24)', link: 'rgba(104,165,42,0.16)', txt: '#68a52a' },
}

// Module-level path generator (doesn't need to be recreated)
const makePath = sankeyLinkHorizontal()

export default function AboutSankey() {
  const svgRef = useRef(null)

  const { nodes, links } = useMemo(() => {
    const layout = createSankey()
      .nodeId(d => d.id)
      .nodeAlign(sankeyLeft)
      .nodeWidth(NW)
      .nodePadding(NP)
      .extent([[0, 0], [CW, CH]])

    return layout({
      nodes: RAW_NODES.map(d => ({ ...d })),
      links: RAW_LINKS.map(d => ({ ...d })),
    })
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: 'top 82%' }
      gsap.fromTo(el.querySelectorAll('.sk-lk'),
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power2.out', scrollTrigger: st })
      gsap.fromTo(el.querySelectorAll('.sk-nd'),
        { opacity: 0 },
        { opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.3, scrollTrigger: st })
      gsap.fromTo(el.querySelectorAll('.sk-lb'),
        { opacity: 0, x: 5 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', delay: 0.6, scrollTrigger: st })
    }, el)
    return () => ctx.revert()
  }, [nodes, links])

  return (
    <div className="rounded-2xl p-6 pb-8" style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>
      <div className="flex items-center justify-between mb-5">
        <p className="label-tag">Design Process Breakdown</p>
        <p className="text-white/20 text-xs">Based on total working hours</p>
      </div>

      <svg
        ref={svgRef}
        viewBox={`-110 -24 ${CW + 260} ${CH + 44}`}
        className="w-full"
        style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {/* ── Links (drawn behind nodes) ── */}
        {links.map((l, i) => {
          const col = C[l.source.cat]
          return (
            <path key={i} className="sk-lk"
              d={makePath(l)}
              fill="none"
              stroke={col.link}
              strokeWidth={Math.max(l.width, 1)}
              opacity={0}
            />
          )
        })}

        {/* ── Nodes + Labels ── */}
        {nodes.map(n => {
          const col  = C[n.cat]
          const midY = (n.y0 + n.y1) / 2
          const h    = Math.max(n.y1 - n.y0, 1)
          const isSrc = n.depth === 0
          const isCat = n.depth === 1
          const isSub = n.depth === 2

          return (
            <g key={n.id}>
              {/* Node rect */}
              <rect className="sk-nd"
                x={n.x0} y={n.y0} width={NW} height={h}
                fill={col.node} stroke={col.stroke}
                strokeWidth={1} rx={3} opacity={0}
              />

              {/* Source: label to the left */}
              {isSrc && (
                <text className="sk-lb"
                  x={n.x0 - 12} y={midY}
                  textAnchor="end" dominantBaseline="middle"
                  fill={col.txt} fontSize={10} fontWeight={700}
                  letterSpacing="0.06em" opacity={0}>
                  DESIGN PROCESS
                </text>
              )}

              {/* Category: label above node */}
              {isCat && (
                <text className="sk-lb"
                  x={n.x0 + NW / 2} y={n.y0 - 7}
                  textAnchor="middle" dominantBaseline="auto"
                  fill={col.txt} fontSize={9} fontWeight={700} opacity={0}>
                  {n.pct} · {n.name}
                </text>
              )}

              {/* Sub-item: pct + name to the right */}
              {isSub && (
                <>
                  <text className="sk-lb"
                    x={n.x1 + 11} y={midY - 6}
                    dominantBaseline="middle"
                    fill={col.txt} fontSize={9} fontWeight={700} opacity={0}>
                    {n.pct}
                  </text>
                  <text className="sk-lb"
                    x={n.x1 + 11} y={midY + 6}
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.45)" fontSize={9} opacity={0}>
                    {n.name}
                  </text>
                </>
              )}
            </g>
          )
        })}

        {/* Caption */}
        <text x={CW / 2} y={CH + 20}
          textAnchor="middle"
          fill="rgba(255,255,255,0.10)" fontSize={8} letterSpacing="0.14em">
          TARIQ ALDINSYAH — DESIGN WORKFLOW
        </text>
      </svg>
    </div>
  )
}
