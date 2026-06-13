import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageWithSkeleton from './ImageWithSkeleton'

gsap.registerPlugin(ScrollTrigger)

const skills = ['Product Design', 'UX Strategy', 'Design System', 'User Research', 'Ecosystem & Platform Design', 'Cross Functional Collaboration']

const achievements = [
  { stat: '40%',  label: 'Dev Efficiency',  sub: 'Improved development efficiency — Rakit Ecosystem' },
  { stat: '20+',  label: 'Cooperatives',     sub: 'Integrated into one ecosystem (CoopIn)' },
  { stat: '20%',  label: 'Active Users',     sub: 'Increased within 3 months — MyKisel Redesign' },
  { stat: '2y+',  label: 'Experience',       sub: 'Across fintech, enterprise & cooperative systems' },
]

export default function About() {
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const statsRef   = useRef(null)
  const statRefs   = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top 78%' }
      gsap.fromTo(leftRef.current,  { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: st })
      gsap.fromTo(rightRef.current, { opacity: 0, x:  40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.15, scrollTrigger: st })
      gsap.fromTo(statsRef.current?.children, { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3, scrollTrigger: st })

      // Counter animation
      achievements.forEach((a, i) => {
        const el = statRefs.current[i]
        if (!el) return
        const match = a.stat.match(/(\d+\.?\d*)/)
        if (!match) return
        const num = parseFloat(match[1])
        const idx = a.stat.indexOf(match[1])
        const prefix = a.stat.slice(0, idx)
        const suffix = a.stat.slice(idx + match[1].length)
        const obj = { val: 0 }
        gsap.to(obj, {
          val: num,
          duration: 1.8,
          ease: 'power2.out',
          delay: 0.4 + i * 0.1,
          onUpdate: () => { el.textContent = prefix + Math.round(obj.val) + suffix },
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-30" />
      <div className="absolute inset-0 grid-overlay opacity-40" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section meta row — like Adspace "Client / Services / Year" */}
        <div className="flex flex-wrap gap-10 mb-16 pb-8 border-b border-[#1e2a0a] text-sm">
          <div><p className="text-white/30 uppercase text-xs tracking-widest mb-1">About the Project</p></div>
          <div className="ml-auto max-w-lg">
            <p className="text-white/40 text-sm leading-relaxed">
              I'm a UI/UX Product Designer with 2+ years of experience designing digital platforms
              across fintech, enterprise systems, cooperative ecosystems, and operational products.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — photo */}
          <div ref={leftRef}>
            {/* Photo */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-6">
              <ImageWithSkeleton
                src="/tariq-photo.jpg"
                alt="Tariq Aldinsyah"
                imgClassName="w-full h-full object-cover object-top"
              />
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => <span key={s} className="pill">{s}</span>)}
            </div>
          </div>

          {/* Right — bio + stats */}
          <div ref={rightRef} className="space-y-8">
            {/* Bio card */}
            <div className="rounded-2xl p-7"
              style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>
              <p className="label-tag mb-4">About the Project</p>
              <p className="text-white/60 leading-relaxed text-sm">
                My focus goes beyond interface design — I'm passionate about building scalable
                digital ecosystems that balance user needs, business goals, and operational efficiency.
                Designing platforms across fintech, cooperatives, HR systems, and enterprise tools
                has given me a systems-first perspective on product design.
              </p>
            </div>

            {/* Stats grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              {achievements.map((a, i) => (
                <div key={a.label}
                  className="rounded-2xl p-6 hover:border-lime/30 transition-colors"
                  style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>
                  <p ref={el => statRefs.current[i] = el} className="text-lime font-black text-3xl leading-none mb-1">{a.stat}</p>
                  <p className="text-white font-semibold text-sm mb-1">{a.label}</p>
                  <p className="text-white/35 text-xs leading-relaxed">{a.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
