import { useMemo, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { sankey as createSankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Maximize2, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CW = 480
const CH = 520
const NW = 18
const NP = 10

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

const C = {
  src:      { node: 'rgba(192,245,61,0.10)', stroke: 'rgba(192,245,61,0.40)', link: 'rgba(192,245,61,0.22)', txt: '#C0F53D' },
  research: { node: 'rgba(192,245,61,0.08)', stroke: 'rgba(192,245,61,0.32)', link: 'rgba(192,245,61,0.22)', txt: '#C0F53D' },
  ux:       { node: 'rgba(150,212,55,0.08)', stroke: 'rgba(150,212,55,0.28)', link: 'rgba(150,212,55,0.18)', txt: '#96d437' },
  ui:       { node: 'rgba(104,165,42,0.08)', stroke: 'rgba(104,165,42,0.24)', link: 'rgba(104,165,42,0.16)', txt: '#68a52a' },
}

const makePath = sankeyLinkHorizontal()

// Shared SVG content — animated=false for modal (fully visible)
function SankeyContent({ nodes, links, animated = false }) {
  const op = animated ? 0 : 1
  return (
    <>
      {links.map((l, i) => {
        const col = C[l.source.cat]
        return (
          <path key={i} className={animated ? 'sk-lk' : undefined}
            d={makePath(l)} fill="none"
            stroke={col.link} strokeWidth={Math.max(l.width, 1)} opacity={op}
          />
        )
      })}

      {nodes.map(n => {
        const col  = C[n.cat]
        const midY = (n.y0 + n.y1) / 2
        const h    = Math.max(n.y1 - n.y0, 1)
        const isSrc = n.depth === 0
        const isCat = n.depth === 1
        const isSub = n.depth === 2
        return (
          <g key={n.id}>
            <rect className={animated ? 'sk-nd' : undefined}
              x={n.x0} y={n.y0} width={NW} height={h}
              fill={col.node} stroke={col.stroke}
              strokeWidth={1} rx={3} opacity={op}
            />
            {isSrc && (
              <text className={animated ? 'sk-lb' : undefined}
                x={n.x0 - 12} y={midY}
                textAnchor="end" dominantBaseline="middle"
                fill={col.txt} fontSize={10} fontWeight={700}
                letterSpacing="0.06em" opacity={op}>
                DESIGN PROCESS
              </text>
            )}
            {isCat && (
              <text className={animated ? 'sk-lb' : undefined}
                x={n.x0 + NW / 2} y={n.y0 - 7}
                textAnchor="middle" dominantBaseline="auto"
                fill={col.txt} fontSize={9} fontWeight={700} opacity={op}>
                {n.pct} · {n.name}
              </text>
            )}
            {isSub && (
              <>
                <text className={animated ? 'sk-lb' : undefined}
                  x={n.x1 + 11} y={midY - 6}
                  dominantBaseline="middle"
                  fill={col.txt} fontSize={9} fontWeight={700} opacity={op}>
                  {n.pct}
                </text>
                <text className={animated ? 'sk-lb' : undefined}
                  x={n.x1 + 11} y={midY + 6}
                  dominantBaseline="middle"
                  fontSize={9} opacity={op}
                  style={{ fill: 'var(--text-40)' }}>
                  {n.name}
                </text>
              </>
            )}
          </g>
        )
      })}

      <text x={CW / 2} y={CH + 20}
        textAnchor="middle" fontSize={8} letterSpacing="0.14em"
        style={{ fill: 'var(--text-10)' }}>
        TARIQ ALDINSYAH — DESIGN WORKFLOW
      </text>
    </>
  )
}

export default function AboutSankey() {
  const svgRef   = useRef(null)
  const modalRef = useRef(null)
  const [open, setOpen] = useState(false)

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

  // Card scroll animation
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: 'top 82%' }
      gsap.fromTo(el.querySelectorAll('.sk-lk'),
        { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power2.out', scrollTrigger: st })
      gsap.fromTo(el.querySelectorAll('.sk-nd'),
        { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.3, scrollTrigger: st })
      gsap.fromTo(el.querySelectorAll('.sk-lb'),
        { opacity: 0, x: 5 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', delay: 0.6, scrollTrigger: st })
    }, el)
    return () => ctx.revert()
  }, [nodes, links])

  // Modal open/close + scroll lock
  useEffect(() => {
    if (!open) return
    if (window.__lenis) window.__lenis.stop()
    document.body.style.overflow = 'hidden'

    // Animate modal in
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' })
    }

    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)

    return () => {
      if (window.__lenis) window.__lenis.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0, scale: 0.95, y: 10, duration: 0.2, ease: 'power2.in',
        onComplete: () => setOpen(false),
      })
    } else {
      setOpen(false)
    }
  }

  const vb = `−110 −24 ${CW + 260} ${CH + 44}`

  return (
    <>
      {/* ── Card ─────────────────────────────────────────── */}
      <div className="rounded-2xl p-6 pb-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="label-tag">Design Process Breakdown</p>
          <div className="flex items-center gap-3">
            <p style={{ color: 'var(--text-20)', fontSize: '0.7rem' }}>Based on total working hours</p>
            <button
              onClick={() => setOpen(true)}
              title="Expand diagram"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:scale-110"
              style={{ background: 'var(--medium)', border: '1px solid var(--border)', color: 'var(--lime-text)' }}>
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        <svg ref={svgRef}
          viewBox={`-110 -24 ${CW + 260} ${CH + 44}`}
          className="w-full"
          style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}>
          <SankeyContent nodes={nodes} links={links} animated={true} />
        </svg>
      </div>

      {/* ── Modal Portal ──────────────────────────────────── */}
      {open && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 lg:p-8"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          onClick={closeModal}>

          <div ref={modalRef}
            className="relative w-full rounded-2xl p-6 lg:p-10"
            style={{
              maxWidth: 900,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="label-tag mb-1">Design Process Breakdown</p>
                <p style={{ color: 'var(--text-30)', fontSize: '0.7rem' }}>Based on total working hours</p>
              </div>
              <button onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
                style={{ background: 'var(--medium)', border: '1px solid var(--border)', color: 'var(--text-50)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Full-res SVG (no animation, fully visible) */}
            <svg
              viewBox={`-110 -24 ${CW + 260} ${CH + 44}`}
              className="w-full"
              style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}>
              <SankeyContent nodes={nodes} links={links} animated={false} />
            </svg>

            {/* ESC hint */}
            <p className="text-center mt-4" style={{ color: 'var(--text-20)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              PRESS ESC OR CLICK OUTSIDE TO CLOSE
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
