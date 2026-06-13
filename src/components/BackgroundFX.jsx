import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function DotGrid({ cols = 5, rows = 5, gap = 14, r = 1.2, opacity = 0.35 }) {
  const w = cols * gap
  const h = rows * gap
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ opacity }}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <circle key={`${row}-${col}`}
            cx={col * gap + gap / 2} cy={row * gap + gap / 2}
            r={r} fill="#C0F53D" />
        ))
      )}
    </svg>
  )
}

function Cross({ size = 20, strokeWidth = 1, opacity = 0.5 }) {
  const h = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <line x1={h} y1="0" x2={h} y2={size} stroke="#C0F53D" strokeWidth={strokeWidth} />
      <line x1="0" y1={h} x2={size} y2={h} stroke="#C0F53D" strokeWidth={strokeWidth} />
    </svg>
  )
}

export default function BackgroundFX() {
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const ring3Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ring1Ref.current, { rotation: 360,  duration: 160, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      gsap.to(ring2Ref.current, { rotation: -360, duration: 100, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      gsap.to(ring3Ref.current, { rotation: 360,  duration: 200, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="pointer-events-none select-none">

      {/* ── Film grain ── */}
      <svg className="fixed inset-0 z-[2]"
        style={{ width: '100%', height: '100%', opacity: 0.04, mixBlendMode: 'screen' }}
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── Top-right ring cluster ── */}
      <div className="fixed top-0 right-0 z-[2] overflow-hidden"
        style={{ width: 640, height: 640, transform: 'translate(30%, -30%)' }}>
        <svg width="640" height="640" viewBox="0 0 640 640" fill="none">
          <circle ref={ring1Ref} cx="320" cy="320" r="300"
            stroke="#C0F53D" strokeWidth="0.6" strokeOpacity="0.1" strokeDasharray="5 18" />
          <circle ref={ring2Ref} cx="320" cy="320" r="210"
            stroke="#C0F53D" strokeWidth="0.5" strokeOpacity="0.07" strokeDasharray="2 10" />
          <circle cx="320" cy="320" r="120"
            stroke="#C0F53D" strokeWidth="0.5" strokeOpacity="0.05" />
          <circle cx="320" cy="320" r="4" fill="#C0F53D" fillOpacity="0.15" />
          <line x1="270" y1="320" x2="370" y2="320" stroke="#C0F53D" strokeWidth="0.5" strokeOpacity="0.12" />
          <line x1="320" y1="270" x2="320" y2="370" stroke="#C0F53D" strokeWidth="0.5" strokeOpacity="0.12" />
        </svg>
      </div>

      {/* ── Bottom-left ring ── */}
      <div className="fixed bottom-0 left-0 z-[2]"
        style={{ width: 480, height: 480, transform: 'translate(-35%, 35%)' }}>
        <svg width="480" height="480" viewBox="0 0 480 480" fill="none">
          <circle ref={ring3Ref} cx="240" cy="240" r="220"
            stroke="#C0F53D" strokeWidth="0.6" strokeOpacity="0.08" strokeDasharray="4 14" />
          <circle cx="240" cy="240" r="145"
            stroke="#C0F53D" strokeWidth="0.5" strokeOpacity="0.05" />
          <circle cx="240" cy="240" r="4" fill="#C0F53D" fillOpacity="0.1" />
        </svg>
      </div>

      {/* ── Abstract arc — left ── */}
      <div className="fixed z-[2]" style={{ top: '12%', left: -50, opacity: 0.08 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path d="M 200 0 A 200 200 0 0 0 0 200" stroke="#C0F53D" strokeWidth="1" />
          <path d="M 155 0 A 155 155 0 0 0 0 155" stroke="#C0F53D" strokeWidth="0.6" strokeDasharray="4 10" />
          <path d="M 110 0 A 110 110 0 0 0 0 110" stroke="#C0F53D" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── Dot grids ── */}
      <div className="fixed z-[2]" style={{ top: 80, left: 20 }}>
        <DotGrid cols={7} rows={7} gap={13} r={1.2} opacity={0.12} />
      </div>
      <div className="fixed z-[2]" style={{ bottom: 50, right: 20 }}>
        <DotGrid cols={8} rows={6} gap={13} r={1.2} opacity={0.1} />
      </div>
      <div className="fixed z-[2]" style={{ top: '40%', right: 20 }}>
        <DotGrid cols={4} rows={8} gap={12} r={1} opacity={0.08} />
      </div>

      {/* ── Cross / plus markers ── */}
      <div className="fixed z-[2]" style={{ top: '25%', left: 20 }}>
        <Cross size={22} strokeWidth={1.2} opacity={0.18} />
      </div>
      <div className="fixed z-[2]" style={{ top: '50%', left: 20 }}>
        <Cross size={22} strokeWidth={1.2} opacity={0.18} />
      </div>
      <div className="fixed z-[2]" style={{ top: '75%', left: 20 }}>
        <Cross size={22} strokeWidth={1.2} opacity={0.18} />
      </div>
      <div className="fixed z-[2]" style={{ top: '20%', right: 20 }}>
        <Cross size={22} strokeWidth={1.2} opacity={0.15} />
      </div>
      <div className="fixed z-[2]" style={{ top: '65%', right: 20 }}>
        <Cross size={22} strokeWidth={1.2} opacity={0.15} />
      </div>

      {/* ── Corner tick marks — top-left ── */}
      <div className="fixed top-0 left-0 z-[2]" style={{ opacity: 0.13 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <line x1="0" y1="20" x2="20" y2="20" stroke="#C0F53D" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="#C0F53D" strokeWidth="1" />
        </svg>
      </div>

      {/* ── Corner tick marks — bottom-right ── */}
      <div className="fixed bottom-0 right-0 z-[2]" style={{ opacity: 0.13 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <line x1="40" y1="20" x2="20" y2="20" stroke="#C0F53D" strokeWidth="1" />
          <line x1="20" y1="40" x2="20" y2="20" stroke="#C0F53D" strokeWidth="1" />
        </svg>
      </div>

    </div>
  )
}
