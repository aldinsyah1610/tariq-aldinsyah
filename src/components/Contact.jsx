import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ExternalLink, Globe, Phone } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef(null)
  const darkRef    = useRef(null)
  const limeRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(darkRef.current, { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } })
      gsap.fromTo(limeRef.current, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="bg-dark relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Dark top section — testimonial/contact links style */}
      <div ref={darkRef} className="relative py-24 max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <div className="blob blob-lime w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

        <div className="relative">
          {/* Links row */}
          <div className="flex flex-wrap justify-center gap-8 mb-16 text-white/25 text-xs tracking-widest uppercase">
            <a href="https://linkedin.com/in/tariqaldinsyah" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-lime transition-colors">
              <ExternalLink size={11} />linkedin.com/in/tariqaldinsyah
            </a>
            <a href="https://behance.net/tariqaldinsyah" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-lime transition-colors">
              <Globe size={11} />behance.net/tariqaldinsyah
            </a>
            <a href="tel:+62811922857"
              className="flex items-center gap-2 hover:text-lime transition-colors">
              <Phone size={11} />+62 811 922 857
            </a>
          </div>

          {/* Giant heading — like "What our clients are saying." */}
          <h2 className="font-black leading-[1.05] tracking-tight text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>
            Interested in working{' '}
            <span className="font-serif italic font-semibold text-lime">together?</span>
          </h2>

          {/* Circular badge — like Adspace globe badge */}
          <div className="w-20 h-20 rounded-full border-2 border-lime/30 flex items-center justify-center mx-auto my-10">
            <span className="text-lime text-2xl">✦</span>
          </div>
        </div>
      </div>

      {/* Lime CTA block — like Adspace "Let's orbit" lime section */}
      <div ref={limeRef} className="relative rounded-3xl mx-4 sm:mx-8 lg:mx-16 mb-8 overflow-hidden"
        style={{ background: '#8fc922' }}>
        <div className="py-20 px-8 lg:px-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(8,12,2,0.55)' }}>Let's Collaborate</p>
          <h3 className="font-black leading-[1.05] tracking-tight mb-2" style={{ color: '#080c02', fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>
            Let us help your company accelerate{' '}
            <span className="font-serif italic font-semibold">years ahead.</span>
          </h3>
          <div className="mt-10">
            <a href="mailto:aldinsyah1610@gmail.com"
              className="inline-flex items-center gap-2 border-2 font-bold px-8 py-3.5 rounded-full text-sm tracking-wide transition-all"
              style={{ color: '#080c02', borderColor: '#080c02' }}
              onMouseEnter={e => { e.currentTarget.style.background='#080c02'; e.currentTarget.style.color='#C0F53D' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#080c02' }}>
              Contact Me <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer dark — like Adspace footer */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 pb-12 border-b border-[#1e2a0a]">
          <div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="wordmark-box mb-4 inline-block">
              Tariq Aldinsyah
            </button>
            <p className="text-white/25 text-xs leading-relaxed">
              UI/UX Product Designer building scalable digital ecosystems and user-centered products.
            </p>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Work</p>
            <div className="space-y-2">
              {[
                { label: 'Rakit Ecosystem', href: '#projects' },
                { label: 'CoopIn',          href: '#projects' },
                { label: 'MyKisel',         href: '#projects' },
                { label: 'BayarAja',        href: '#more-projects' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  onClick={e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="block text-white/35 text-sm hover:text-lime transition-colors cursor-pointer">{label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Connect</p>
            <div className="space-y-2">
              {[['LinkedIn', 'https://linkedin.com/in/tariqaldinsyah'], ['Behance', 'https://behance.net/tariqaldinsyah']].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  className="block text-white/35 text-sm hover:text-lime transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between text-white/20 text-xs">
          <span>©2026 – Tariq Aldinsyah Portofolio</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
            Available for work
          </span>
        </div>
      </div>
    </section>
  )
}
