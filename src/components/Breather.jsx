import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CountUp from './CountUp'

gsap.registerPlugin(ScrollTrigger)

const STATS = [['2+', 'Years Exp.'], ['20+', 'Products Built'], ['3', 'Platforms']]

export default function Breather() {
  const sectionRef = useRef(null)
  const taglineRef = useRef(null)
  const statsRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const st = { trigger: sectionRef.current, start: 'top 82%' }

      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: st })

      gsap.fromTo(statsRef.current?.children,
        { opacity: 0, x: 28 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.25, scrollTrigger: st })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 overflow-hidden" style={{ background: '#C0F53D' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <p ref={taglineRef} className="font-black text-dark leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.8rem)' }}>
          UI/UX that bridges<br />
          <span className="font-serif italic font-semibold">business goals</span>{' & real users.'}
        </p>
        <div ref={statsRef} className="flex gap-10 sm:gap-14 shrink-0">
          {STATS.map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-black text-dark leading-none" style={{ fontSize: 'clamp(2rem, 3.2vw, 3.2rem)' }}>
                <CountUp value={val} />
              </p>
              <p className="text-dark/50 text-xs mt-1 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
