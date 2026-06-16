import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords, splitChars } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { title: 'User & Business Balance',        desc: 'Balancing user needs with operational and business objectives to deliver meaningful, sustainable solutions.' },
  { title: 'Cross Functional Collaboration', desc: 'Working closely with product, engineering, and stakeholders to ship impactful solutions together.' },
  { title: 'System & Ecosystem Thinking',    desc: 'Designing interconnected products and platforms that scale cohesively across a larger digital ecosystem.' },
  { title: 'Data-Informed Design',           desc: 'Using research, usability feedback, and metrics to continuously refine and improve product experiences.' },
  { title: 'Continuous Iteration',           desc: 'Constantly testing assumptions, gathering feedback, and refining solutions to ensure long-term product relevance and impact.' },
]

export default function BeyondDesign() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const cardsRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const st    = { trigger: sectionRef.current, start: 'top 78%' }
      const h2 = headRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.09, ease: 'power3.out', scrollTrigger: st })
        gsap.from(chars, { y: '105%', stagger: 0.055, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: st })
      }

      gsap.fromTo(cardsRef.current?.children, { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: cardsRef.current, start: 'top 82%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="mb-16">
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">Beyond </span>
            <span className="font-serif italic font-semibold text-lime">Interface Design</span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {cards.map((c, i) => (
            <div key={c.title}
              className={`rounded-2xl p-6 hover:border-lime/30 transition-all group cursor-default
                ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
                ${i === 4 ? 'sm:col-span-2 lg:col-span-3' : ''}`}
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-white font-bold text-base mb-3 group-hover:text-lime transition-colors leading-snug">
                {c.title}
              </h3>
              <p className="text-white/35 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
