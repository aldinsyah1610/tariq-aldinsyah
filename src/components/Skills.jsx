import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords, splitChars } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const skillGroups = [
  { category: 'Product & UX',   tags: ['Product Thinking', 'UX Strategy', 'User Research', 'Wireframing', 'Prototyping', 'User Flow', 'Usability Testing'] },
  { category: 'Design Systems', tags: ['Component Libraries', 'Design Tokens', 'Pattern Libraries', 'Material UI (MUI)', 'Modular Design'] },
  { category: 'Tools',          tags: ['Figma', 'Miro', 'Notion', 'Adobe Illustrator', 'Adobe Photoshop', 'Canva'] },
  { category: 'Collaboration',  tags: ['Stakeholder Management', 'Cross Functional Teamwork', 'Design Handoff', 'Product Discussion', 'PRD Analysis'] },
  { category: 'AI & Emerging',  tags: ['ChatGPT', 'Claude', 'Gemini', 'MidJourney'] },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const listRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st  = { trigger: sectionRef.current, start: 'top 78%' }
      const lst = { trigger: listRef.current, start: 'top 82%' }
      const h2  = headerRef.current?.querySelector('h2')
      const label = headerRef.current?.querySelector('.label-tag')

      gsap.fromTo(label, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: st })

      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.09, ease: 'power3.out', scrollTrigger: st })
        gsap.from(chars, { y: '105%', stagger: 0.05, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: st })
      }

      // Rows slide in
      if (listRef.current)
        gsap.fromTo(listRef.current.children, { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: lst })

      // Each individual skill tag pops in
      const tags = listRef.current?.querySelectorAll('.skill-tag')
      if (tags?.length)
        gsap.from(tags, {
          scale: 0.6, opacity: 0,
          stagger: { amount: 0.9, from: 'start' },
          duration: 0.4, ease: 'back.out(2)',
          delay: 0.15,
          scrollTrigger: lst,
        })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[450px] h-[450px] bottom-0 left-[-80px] opacity-15" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-14">
          <p className="label-tag mb-4">Expertise</p>
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>
            <span className="text-white">Skills & </span>
            <span className="font-serif italic font-semibold text-lime">Expertise</span>
          </h2>
        </div>

        {/* Dark card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="grid lg:grid-cols-3">

            {/* Left label */}
            <div className="p-8 lg:p-12 lg:border-r border-[#1e2a0a] flex flex-col justify-between">
              <div>
                <p className="text-white/30 text-xs leading-relaxed mb-6">
                  A product design skill set built around user empathy, scalable systems, and cross-functional collaboration.
                </p>
                <h3 className="font-black leading-tight text-white"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}>
                  What I{' '}
                  <span className="font-serif italic font-semibold text-lime">know best.</span>
                </h3>
              </div>
              <div className="mt-8 hidden lg:block">
                <p className="text-white/20 text-xs uppercase tracking-widest">{skillGroups.length} Skill Areas</p>
              </div>
            </div>

            {/* Skill groups */}
            <div ref={listRef} className="lg:col-span-2 divide-y divide-[#1e2a0a]">
              {skillGroups.map((g, i) => (
                <div key={g.category}
                  className="px-8 py-6 grid sm:grid-cols-3 gap-4 items-start hover:bg-lime/[0.03] transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-lime/40 text-sm font-bold tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-white/70 font-bold text-sm">{g.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    {g.tags.map((t) => (
                      <span key={t}
                        className="skill-tag text-xs font-medium text-white/40 border border-white/10 rounded-full px-3 py-1.5
                          hover:bg-lime hover:text-dark hover:border-lime transition-all cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
