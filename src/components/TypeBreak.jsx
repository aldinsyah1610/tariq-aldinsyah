import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TypeBreak() {
  const sectionRef = useRef(null)
  const line1Ref   = useRef(null)
  const line2Ref   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const st = { trigger: sectionRef.current, start: 'top 82%' }
      gsap.fromTo(line1Ref.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power4.inOut', scrollTrigger: st })
      gsap.fromTo(line2Ref.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power4.inOut', delay: 0.18, scrollTrigger: st })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="relative bg-dark overflow-hidden py-16 sm:py-24"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p
          ref={line1Ref}
          className="font-black tracking-tight leading-none"
          style={{ fontSize: 'clamp(1.2rem, 3.5vw, 3rem)', color: 'var(--text-30)' }}>
          Not just screens —
        </p>
        <p
          ref={line2Ref}
          className="font-serif italic font-semibold text-lime leading-[0.9]"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 9.5rem)', letterSpacing: '-0.025em' }}>
          Ecosystems.
        </p>
      </div>
    </section>
  )
}
