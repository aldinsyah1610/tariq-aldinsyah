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
    <div className="overflow-hidden py-4" style={{ borderTop: '1px solid #1e2a0a', borderBottom: '1px solid #1e2a0a', background: 'var(--bg)' }}>
      <div ref={trackRef} className="flex gap-10 w-max" style={{ willChange: 'transform' }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap select-none"
            style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.65rem', letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase' }}>
            {item}
            <span style={{ color: 'rgba(192,245,61,0.35)', fontSize: '0.8rem' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
