import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageWithSkeleton from './ImageWithSkeleton'
import { splitWords } from '../utils/splitText'
import DomainBreakdown from './DomainBreakdown'

gsap.registerPlugin(ScrollTrigger)

const skills = ['Product Design', 'UX Strategy', 'Design System', 'User Research', 'Ecosystem & Platform Design', 'Cross Functional Collaboration']

export default function About() {
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const bioRef     = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const st = { trigger: sectionRef.current, start: 'top 78%' }

      gsap.fromTo(leftRef.current,  { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: st })
      gsap.fromTo(rightRef.current, { opacity: 0, x:  40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.15, scrollTrigger: st })

      // Photo parallax scrub — pointer-fine only to avoid jank on touch
      const photo = leftRef.current?.querySelector('.photo-parallax')
      if (photo && isFine)
        gsap.to(photo, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })

      // Skill tags pop in
      const pills = leftRef.current?.querySelectorAll('.pill')
      if (pills?.length)
        gsap.from(pills, {
          opacity: 0, scale: 0.7, y: 8,
          stagger: 0.05, duration: 0.4, ease: 'back.out(2)', delay: 0.4,
          scrollTrigger: st,
        })

      // Bio text scrub reveal — each word brightens as you scroll through
      if (bioRef.current) {
        const words = splitWords(bioRef.current)
        if (words.length) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: bioRef.current,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 1.5,
            },
          })
          tl.from(words, { opacity: 0.12, stagger: 0.25, ease: 'none' })
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section meta row — like Adspace "Client / Services / Year" */}
        <div className="flex flex-wrap gap-10 mb-16 pb-8 border-b border-[#1e2a0a] text-sm">
          <div><p className="text-white/30 uppercase text-xs tracking-widest mb-1">About Me</p></div>
          <div className="ml-auto max-w-lg">
            <p className="text-white/40 text-sm leading-relaxed">
              I'm a UI/UX Product Designer with 2+ years of experience designing digital platforms
              across fintech, enterprise systems, cooperative ecosystems, and operational products.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          {/* Left — photo */}
          <div ref={leftRef} className="flex flex-col">
            {/* Photo fills full column height; skill tags overlaid at bottom */}
            <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative" style={{ minHeight: '320px' }}>
              <div className="photo-parallax absolute inset-0" style={{ willChange: 'transform' }}>
                <ImageWithSkeleton
                  src="/tariq-photo.jpg"
                  alt="Tariq Aldinsyah"
                  imgClassName="w-full h-full object-cover object-top"
                  style={{ transform: 'scale(1.12)' }}
                />
              </div>
              {/* Skill tags overlaid at bottom of photo */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-5"
                style={{ background: 'linear-gradient(to top, rgba(7,7,7,0.82) 0%, rgba(7,7,7,0.3) 60%, transparent 100%)' }}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => <span key={s} className="pill">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Right — bio + domain breakdown */}
          <div ref={rightRef} className="flex flex-col gap-8">
            {/* Bio card */}
            <div className="rounded-2xl p-7"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p ref={bioRef} className="text-white/60 leading-relaxed text-sm">
                My focus goes beyond interface design — I'm passionate about building scalable
                digital ecosystems that balance user needs, business goals, and operational efficiency.
                Designing platforms across fintech, cooperatives, HR systems, and enterprise tools
                has given me a systems-first perspective on product design.
              </p>
            </div>

            {/* Domain breakdown — flex-1 stretches to match photo column height */}
            <DomainBreakdown />
          </div>
        </div>
      </div>
    </section>
  )
}
