import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

/* ── Tree layout constants ── */
const TW = 680, TH = 380
const HUB = { x: 70, y: 190, r: 26 }
const MOD_X = 230, MOD_R = 20
const APP_X = 415, APP_R = 14
const LABEL_X = APP_X + APP_R + 6
const MOD_YS = [75, 190, 305]
const APP_SPACING = 26

/* Abbreviated labels for module circles (must fit r=20) */
const MOD_SHORT = { hris: 'HRIS', payment: 'Pay', coop: 'Coop' }

/* ── Radial layout constants ── */
const W = 600, H = 340
const HUB_R = 28, NODE_R = 20, RING_R = 110, LABEL_R = RING_R + NODE_R + 16

const PALETTE = {
  dark: {
    hub:      { fill: 'rgba(192,245,61,0.10)',  stroke: 'rgba(192,245,61,0.52)', text: '#C0F53D',  line: 'rgba(192,245,61,0.22)' },
    hris:     { fill: 'rgba(78,205,196,0.08)',   stroke: 'rgba(78,205,196,0.45)', text: '#4ECDC4',  line: 'rgba(78,205,196,0.22)' },
    payment:  { fill: 'rgba(149,165,184,0.08)',  stroke: 'rgba(149,165,184,0.45)', text: '#95A5B8', line: 'rgba(149,165,184,0.22)' },
    coop:     { fill: 'rgba(192,245,61,0.06)',   stroke: 'rgba(192,245,61,0.32)', text: '#C0F53D',  line: 'rgba(192,245,61,0.15)' },
    platform: { fill: 'rgba(192,245,61,0.08)',   stroke: 'rgba(192,245,61,0.38)', text: '#C0F53D',  line: 'rgba(192,245,61,0.18)' },
    product:  { fill: 'rgba(78,205,196,0.08)',   stroke: 'rgba(78,205,196,0.42)', text: '#4ECDC4',  line: 'rgba(78,205,196,0.18)' },
    commerce: { fill: 'rgba(78,205,196,0.08)',   stroke: 'rgba(78,205,196,0.42)', text: '#4ECDC4',  line: 'rgba(78,205,196,0.18)' },
  },
  light: {
    hub:      { fill: 'rgba(92,138,0,0.10)',     stroke: 'rgba(92,138,0,0.55)',   text: '#5C8A00',  line: 'rgba(92,138,0,0.22)' },
    hris:     { fill: 'rgba(14,116,144,0.07)',   stroke: 'rgba(14,116,144,0.44)', text: '#0E7490',  line: 'rgba(14,116,144,0.18)' },
    payment:  { fill: 'rgba(71,85,105,0.07)',    stroke: 'rgba(71,85,105,0.44)',  text: '#475569',  line: 'rgba(71,85,105,0.18)' },
    coop:     { fill: 'rgba(92,138,0,0.06)',     stroke: 'rgba(92,138,0,0.35)',   text: '#5C8A00',  line: 'rgba(92,138,0,0.15)' },
    platform: { fill: 'rgba(92,138,0,0.07)',     stroke: 'rgba(92,138,0,0.40)',   text: '#5C8A00',  line: 'rgba(92,138,0,0.18)' },
    product:  { fill: 'rgba(14,116,144,0.07)',   stroke: 'rgba(14,116,144,0.44)', text: '#0E7490',  line: 'rgba(14,116,144,0.18)' },
    commerce: { fill: 'rgba(14,116,144,0.07)',   stroke: 'rgba(14,116,144,0.44)', text: '#0E7490',  line: 'rgba(14,116,144,0.18)' },
  },
}

const CAT_LABELS = {
  hris: 'HRIS Suite', payment: 'Payment & Fintech', coop: 'Cooperative Platform',
  platform: 'Core Platforms', product: 'Products Built',
  commerce: 'Commerce Suite',
}

function radialPos(i, n, r, cx = W / 2, cy = H / 2) {
  const angle = (2 * Math.PI * i / n) - Math.PI / 2
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

function computeTree(modules) {
  const modNodes = modules.map((m, i) => ({ ...m, x: MOD_X, y: MOD_YS[i] ?? (75 + i * 115) }))
  const appNodes = [], hubToMod = [], modToApp = []

  modNodes.forEach(mod => {
    hubToMod.push({
      x1: HUB.x, y1: HUB.y, x2: MOD_X, y2: mod.y,
      cat: mod.cat,
      len: Math.hypot(MOD_X - HUB.x, mod.y - HUB.y),
    })
    mod.apps.forEach((app, j) => {
      const ay = mod.y + (j - (mod.apps.length - 1) / 2) * APP_SPACING
      appNodes.push({ ...app, x: APP_X, y: ay, cat: mod.cat })
      modToApp.push({
        x1: MOD_X, y1: mod.y, x2: APP_X, y2: ay,
        cat: mod.cat,
        len: Math.hypot(APP_X - MOD_X, ay - mod.y),
      })
    })
  })
  return { modNodes, appNodes, hubToMod, modToApp }
}

export default function EcosystemGraph({ data }) {
  const svgRef  = useRef(null)
  const { theme } = useTheme()
  const P       = theme === 'light' ? PALETTE.light : PALETTE.dark
  const isTree  = Boolean(data.modules)

  /* Tree computed positions */
  const tree = useMemo(
    () => isTree ? computeTree(data.modules) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTree, data],
  )

  /* Radial computed positions */
  const cx = W / 2, cy = H / 2
  const N  = !isTree ? data.nodes.length : 0
  const positions      = useMemo(() => !isTree ? data.nodes.map((_, i) => radialPos(i, N, RING_R, cx, cy)) : [], [isTree, N, cx, cy])
  const labelPositions = useMemo(() => !isTree ? data.nodes.map((_, i) => radialPos(i, N, LABEL_R, cx, cy)) : [], [isTree, N, cx, cy])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (isTree) {
        /* Set initial hidden state */
        gsap.set(el.querySelectorAll('.eg-hub, .eg-mod, .eg-app, .eg-lb'), { opacity: 0 })
        el.querySelectorAll('.eg-m-lk, .eg-a-lk').forEach(line => {
          const len = +line.dataset.len
          gsap.set(line, { attr: { 'stroke-dasharray': len, 'stroke-dashoffset': len } })
        })

        if (reduced) {
          gsap.set(el.querySelectorAll('.eg-hub, .eg-mod, .eg-app, .eg-lb'), { opacity: 1 })
          el.querySelectorAll('.eg-m-lk, .eg-a-lk').forEach(line =>
            gsap.set(line, { attr: { 'stroke-dashoffset': 0 } }))
          return
        }

        const st = { trigger: el, start: 'top 84%', once: true }

        /* 1. Hub */
        gsap.to(el.querySelectorAll('.eg-hub'),
          { opacity: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: st })

        /* 2. Hub→Module lines draw */
        el.querySelectorAll('.eg-m-lk').forEach((line, i) => {
          const len = +line.dataset.len
          gsap.to(line, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 0.55, ease: 'power2.out', delay: 0.2 + i * 0.1, scrollTrigger: st,
          })
        })

        /* 3. Module circles */
        gsap.to(el.querySelectorAll('.eg-mod'),
          { opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.52, scrollTrigger: st })

        /* 4. Module→App lines draw */
        el.querySelectorAll('.eg-a-lk').forEach((line, i) => {
          const len = +line.dataset.len
          gsap.to(line, {
            attr: { 'stroke-dashoffset': 0 },
            duration: 0.4, ease: 'power2.out', delay: 0.7 + i * 0.04, scrollTrigger: st,
          })
        })

        /* 5. App circles + labels */
        gsap.to(el.querySelectorAll('.eg-app'),
          { opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.9, scrollTrigger: st })
        gsap.to(el.querySelectorAll('.eg-lb'),
          { opacity: 1, x: 0, duration: 0.28, stagger: 0.03, ease: 'power2.out', delay: 1.05, scrollTrigger: st })

      } else {
        /* Radial layout (CoopIn) — unchanged */
        if (reduced) return
        const st = { trigger: el, start: 'top 84%', once: true }
        gsap.fromTo(el.querySelectorAll('.eg-hub'),
          { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out', scrollTrigger: st })
        gsap.fromTo(el.querySelectorAll('.eg-lk'),
          { opacity: 0 }, { opacity: 1, duration: 0.65, stagger: 0.07, ease: 'power2.out', delay: 0.18, scrollTrigger: st })
        gsap.fromTo(el.querySelectorAll('.eg-nd'),
          { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', delay: 0.32, scrollTrigger: st })
        gsap.fromTo(el.querySelectorAll('.eg-lb'),
          { opacity: 0, x: 4 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.5, scrollTrigger: st })
      }
    }, el)
    return () => ctx.revert()
  }, [isTree])

  const catKeys = isTree
    ? data.modules.map(m => m.cat)
    : [...new Set(data.nodes.map(n => n.cat))]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <p className="label-tag">Ecosystem Map</p>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-20)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {isTree ? 'hub · module · app' : 'hub · node diagram'}
        </p>
      </div>

      {/* Desktop: SVG */}
      <div className="hidden sm:block px-4 pb-4">
        <svg
          ref={svgRef}
          viewBox={isTree ? `0 0 ${TW} ${TH}` : `0 0 ${W} ${H}`}
          className="w-full"
          style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
          aria-label={`${data.hub.name} ecosystem diagram`}
        >
          {isTree ? (
            <>
              {/* Hub→Module lines */}
              {tree.hubToMod.map((l, i) => (
                <line key={`hml-${i}`} className="eg-m-lk" data-len={l.len}
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke={P[l.cat].line} strokeWidth={1.2} />
              ))}

              {/* Module→App lines */}
              {tree.modToApp.map((l, i) => (
                <line key={`al-${i}`} className="eg-a-lk" data-len={l.len}
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke={P[l.cat].line} strokeWidth={1} />
              ))}

              {/* Hub */}
              <g className="eg-hub">
                <circle cx={HUB.x} cy={HUB.y} r={HUB.r}
                  fill={P.hub.fill} stroke={P.hub.stroke} strokeWidth={1.5} />
                <text x={HUB.x} y={HUB.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fontWeight={700} letterSpacing="0.04em" fill={P.hub.text}>
                  {data.hub.name}
                </text>
              </g>

              {/* Module nodes */}
              {tree.modNodes.map(mod => (
                <g key={mod.id} className="eg-mod">
                  <circle cx={mod.x} cy={mod.y} r={MOD_R}
                    fill={P[mod.cat].fill} stroke={P[mod.cat].stroke} strokeWidth={1.2} />
                  <text x={mod.x} y={mod.y} textAnchor="middle" dominantBaseline="middle"
                    fontSize={7.5} fontWeight={700} letterSpacing="0.03em" fill={P[mod.cat].text}>
                    {MOD_SHORT[mod.cat] ?? mod.name.slice(0, 4)}
                  </text>
                  {/* Module full name below circle */}
                  <text x={mod.x} y={mod.y + MOD_R + 9} textAnchor="middle" dominantBaseline="middle"
                    fontSize={7} fill={P[mod.cat].text} style={{ opacity: 0.7 }}>
                    {mod.name}
                  </text>
                </g>
              ))}

              {/* App circles + labels */}
              {tree.appNodes.map((app) => (
                <g key={app.id}>
                  <circle className="eg-app" cx={app.x} cy={app.y} r={APP_R}
                    fill={P[app.cat].fill} stroke={P[app.cat].stroke} strokeWidth={1} />
                  <g className="eg-lb" style={{ transform: 'translateX(0px)' }}>
                    <text x={LABEL_X} y={app.y - 3} dominantBaseline="middle"
                      fontSize={8} fontWeight={700} fill={P[app.cat].text}>
                      {app.name}
                    </text>
                    <text x={LABEL_X} y={app.y + 8} dominantBaseline="middle"
                      fontSize={6.5} style={{ fill: 'var(--text-30)' }}>
                      {app.desc}
                    </text>
                  </g>
                </g>
              ))}

              {/* Footer sub-label */}
              <text x={TW / 2} y={TH - 4} textAnchor="middle"
                fontSize={7} letterSpacing="0.12em" style={{ fill: 'var(--text-20)' }}>
                {data.hub.sub}
              </text>
            </>
          ) : (
            <>
              {/* Radial: connector lines */}
              {data.nodes.map((node, i) => {
                const pos = positions[i]
                const C   = P[node.cat]
                return (
                  <line key={`line-${node.id}`} className="eg-lk"
                    x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                    stroke={C.line} strokeWidth={1.2} />
                )
              })}

              {/* Radial: hub */}
              <g className="eg-hub">
                <circle cx={cx} cy={cy} r={HUB_R}
                  fill={P.hub.fill} stroke={P.hub.stroke} strokeWidth={1.5} />
                {data.hub.name.split('\n').map((line, li, arr) => (
                  <text key={li} x={cx} y={cy + (li - (arr.length - 1) / 2) * 11}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} fontWeight={700} letterSpacing="0.03em" fill={P.hub.text}>
                    {line}
                  </text>
                ))}
              </g>

              {/* Radial: peripheral nodes */}
              {data.nodes.map((node, i) => {
                const pos  = positions[i]
                const lp   = labelPositions[i]
                const C    = P[node.cat]
                const anchor   = Math.abs(lp.x - cx) < 12 ? 'middle' : lp.x > cx ? 'start' : 'end'
                const nameLines = node.name.split('\n')
                return (
                  <g key={node.id}>
                    <circle className="eg-nd" cx={pos.x} cy={pos.y} r={NODE_R}
                      fill={C.fill} stroke={C.stroke} strokeWidth={1} />
                    <g className="eg-lb">
                      {nameLines.map((line, li) => (
                        <text key={li} x={lp.x}
                          y={lp.y + (li - (nameLines.length - 1) / 2) * 10 - 4}
                          textAnchor={anchor} dominantBaseline="middle"
                          fontSize={8} fontWeight={700} fill={C.text}>{line}</text>
                      ))}
                      <text x={lp.x} y={lp.y + (nameLines.length - 1) * 5 + 7}
                        textAnchor={anchor} dominantBaseline="middle"
                        fontSize={7.5} style={{ fill: 'var(--text-30)' }}>{node.desc}</text>
                    </g>
                  </g>
                )
              })}

              {/* Footer */}
              <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={7} letterSpacing="0.12em"
                style={{ fill: 'var(--text-20)' }}>{data.hub.sub}</text>
            </>
          )}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 px-2">
          {catKeys.map(cat => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: P[cat].text, opacity: 0.8 }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-30)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {CAT_LABELS[cat] ?? cat}
              </span>
            </div>
          ))}
        </div>

        {/* Caption */}
        {data.caption && (
          <p className="text-center mt-3 pb-1" style={{ fontSize: '0.7rem', color: 'var(--text-25)', lineHeight: 1.6 }}>
            {data.caption}
          </p>
        )}
      </div>

      {/* Mobile: list fallback */}
      <div className="sm:hidden px-5 pb-6">
        <p className="font-bold text-sm mb-4" style={{ color: 'var(--text-60)' }}>
          {data.hub.name}
          <span className="font-normal ml-2" style={{ color: 'var(--text-30)', fontSize: '0.75rem' }}>
            {data.hub.sub}
          </span>
        </p>

        {isTree ? (
          <div className="space-y-4">
            {data.modules.map(mod => (
              <div key={mod.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: P[mod.cat].text, opacity: 0.8 }} />
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: P[mod.cat].text }}>
                    {mod.name} — {mod.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pl-4">
                  {mod.apps.map(app => (
                    <div key={app.id} className="rounded-lg px-3 py-1.5"
                      style={{ background: P[mod.cat].fill, border: `1px solid ${P[mod.cat].stroke}` }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: P[mod.cat].text, lineHeight: 1.2 }}>
                        {app.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-30)' }}>{app.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[...new Set(data.nodes.map(n => n.cat))].map(cat => (
              <div key={cat}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: P[cat].text, marginBottom: '0.4rem' }}>
                  {CAT_LABELS[cat] ?? cat}
                </p>
                <div className="flex flex-wrap gap-2 pl-2">
                  {data.nodes.filter(n => n.cat === cat).map(node => (
                    <div key={node.id} className="rounded-lg px-3 py-1.5"
                      style={{ background: P[cat].fill, border: `1px solid ${P[cat].stroke}` }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: P[cat].text, lineHeight: 1.2 }}>
                        {node.name.replace('\n', ' ')}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-30)' }}>{node.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.caption && (
          <p className="mt-4 text-xs leading-relaxed italic" style={{ color: 'var(--text-30)' }}>
            {data.caption}
          </p>
        )}
      </div>
    </div>
  )
}
