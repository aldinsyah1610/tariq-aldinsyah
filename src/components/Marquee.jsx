import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ITEMS = [
  'UI/UX Design', 'Product Strategy', 'Design Systems',
  'User Research', 'Ecosystem Planning', 'Wireframing',
  'Prototyping', 'Figma', 'Cross-Functional', 'Usability Testing',
]

export default function Marquee({ reverse = false, speed = 22 }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: reverse ? 50 : -50,
        repeat: -1,
        duration: speed,
        ease: 'none',
      })
    })
    return () => ctx.revert()
  }, [reverse, speed])

  const items = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden py-4" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div ref={trackRef} className="flex gap-10 w-max" style={{ willChange: 'transform' }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap select-none"
            style={{ color: 'var(--text-20)', fontSize: '0.65rem', letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase' }}>
            {item}
            <span style={{ color: 'var(--lime-text)', opacity: 0.4, fontSize: '0.8rem' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
