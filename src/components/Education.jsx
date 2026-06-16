import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { splitWords, splitChars } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const education = [
  { degree: 'Master of Management',           school: 'Telkom University',                       desc: 'Strategic business thinking and digital business perspectives to complement UX design capabilities.', period: '2025 – Present' },
  { degree: 'Visual & UI/UX Design Bootcamp', school: 'Purwadhika Digital Technology School',    desc: 'Hands-on projects focused on user experience, design systems, and product thinking.',                  period: '2024 – 2025'   },
  { degree: 'Bachelor of Industrial Product Design', school: 'Institut Teknologi Sepuluh Nopember (ITS)', desc: 'Design thinking, problem solving, and user-centered innovation through product development.',        period: '2018 – 2024'   },
]

const achievements = [
  { title: 'Certificate Visual & UI/UX Design Job Connector Bootcamp 2025', org: 'Purwadhika Design School' },
  { title: '1st Place – Kisel Innovation Award 2024',                        org: 'Rakit Ecosystem' },
  { title: '3rd Place – Kompetisi Desain Inovasi Produk Solutif 2023',       org: 'BDI Surabaya · Tricycle Pengangkut Sampah' },
  { title: '5th Place – Kompetisi Desain Inovasi Produk Solutif 2023',       org: 'BDI Surabaya · Mobile Lithium Backup Power' },
  { title: 'Huawei Certificate of Appreciation for New Product',             org: '"PEDATI" Enhance Network Operation Management' },
]

export default function Education() {
  const sectionRef  = useRef(null)
  const headerRef   = useRef(null)
  const eduRef      = useRef(null)
  const achRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const hst = { trigger: sectionRef.current, start: 'top 80%' }
      const h2  = headerRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: hst })
        gsap.from(chars, { y: '105%', stagger: 0.055, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: hst })
      }

      // Education cards slide up
      gsap.fromTo(eduRef.current?.children, { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: eduRef.current, start: 'top 82%' } })

      // Achievements block
      gsap.fromTo(achRef.current, { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: achRef.current, start: 'top 84%' } })

      // Each achievement row slides in from left
      const achRows = achRef.current?.querySelectorAll('.ach-row')
      if (achRows?.length)
        gsap.from(achRows, {
          opacity: 0, x: -24,
          stagger: 0.07, duration: 0.5, ease: 'power2.out', delay: 0.3,
          scrollTrigger: { trigger: achRef.current, start: 'top 84%' },
        })

      // ArrowUpRight icons bounce in
      const arrows = achRef.current?.querySelectorAll('.ach-arrow')
      if (arrows?.length)
        gsap.from(arrows, {
          scale: 0.88, opacity: 0,
          stagger: 0.07, duration: 0.4, ease: 'power3.out', delay: 0.5,
          scrollTrigger: { trigger: achRef.current, start: 'top 84%' },
        })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="education" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="blob blob-lime w-[400px] h-[400px] bottom-0 right-[-60px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 space-y-8">

        {/* Heading */}
        <div ref={headerRef} className="mb-16">
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">Education & </span>
            <span className="font-serif italic font-semibold text-lime">Credentials</span>
          </h2>
        </div>

        {/* Education cards — dark */}
        <div ref={eduRef} className="grid md:grid-cols-3 gap-4">
          {education.map((e) => (
            <div key={e.degree}
              className="rounded-2xl p-7 hover:border-lime/25 transition-colors space-y-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div>
                <p className="label-tag mb-1">{e.period}</p>
                <h3 className="text-white font-bold text-sm leading-snug mt-2">{e.degree}</h3>
                <p className="text-lime/70 text-xs font-medium mt-1">{e.school}</p>
              </div>
              <p className="text-white/35 text-xs leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>

        {/* Achievements — dark card */}
        <div ref={achRef} className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="grid lg:grid-cols-3">
            <div className="p-8 lg:p-12 lg:border-r border-[#1e2a0a] flex flex-col justify-between">
              <div>
                <h3 className="font-black leading-[1.05] tracking-tight text-white"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}>
                  Achievement &{' '}
                  <span className="font-serif italic font-semibold text-lime">Certificates</span>
                </h3>
              </div>
            </div>
            <div className="lg:col-span-2 divide-y divide-[#1e2a0a]">
              {achievements.map((a, i) => (
                <div key={a.title}
                  className="ach-row px-8 py-5 flex items-start justify-between gap-4 group hover:bg-lime/[0.03] transition-colors cursor-default">
                  <div className="flex items-start gap-3">
                    <span className="text-lime/40 text-sm font-bold tabular-nums flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white/80 text-sm leading-snug group-hover:text-white transition-colors">{a.title}</h4>
                      <p className="text-white/30 text-xs uppercase tracking-wider mt-1">{a.org}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="ach-arrow text-white/20 group-hover:text-lime transition-colors flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
