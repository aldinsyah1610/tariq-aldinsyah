import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { num: '01', title: 'Understand Business & User Problems',
    desc: 'Identify operational pain points, stakeholder needs, user behavior, and business objectives through discussions, PRDs, and workflow analysis.',
    tags: ['Stakeholder Alignment', 'Problem Discovery', 'Business Goals', 'User Needs'] },
  { num: '02', title: 'Research & Define Experience',
    desc: 'Map user journeys, information architecture, and product flows to simplify complex systems into intuitive experiences.',
    tags: ['User Flow', 'Information Architecture', 'UX Mapping', 'System Thinking'] },
  { num: '03', title: 'Design Scalable Solutions',
    desc: 'Create wireframes, design systems, and modular interfaces that ensure consistency, scalability, and usability across products.',
    tags: ['Wireframing', 'Design Systems', 'Modular UI', 'Scalability'] },
  { num: '04', title: 'Collaborate & Iterate',
    desc: 'Work closely with product managers, developers, and stakeholders to refine solutions and ensure alignment between business and technical requirements.',
    tags: ['Cross Functional Collaboration', 'Iteration', 'Product Discussion', 'Design Handoff'] },
  { num: '05', title: 'Validate & Improve',
    desc: 'Evaluate usability, gather feedback, and continuously improve product experiences based on user behavior and operational impact.',
    tags: ['Feedback Loop', 'Usability Improvement', 'User Experience Optimization'] },
]

const principles = ['Simplicity', 'Scalability', 'Accessibility', 'User Trust', 'Business Impact', 'Operational Efficiency']

export default function DesignApproach() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top 78%' }
      gsap.fromTo(headerRef.current, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: st })
      if (gridRef.current)
        gsap.fromTo(gridRef.current.children, { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2,
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="approach" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[500px] h-[500px] top-[-80px] right-[-80px] opacity-15" />
      <div className="absolute inset-0 grid-overlay opacity-40" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-6">
          <p className="label-tag mb-4">Process</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-black leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>
              <span className="text-white">My Design </span>
              <span className="font-serif italic font-semibold text-lime">Approach</span>
            </h2>
            <div className="flex flex-wrap gap-2 md:max-w-md">
              {principles.map((p) => (
                <span key={p} className="pill">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-10">
          {steps.map((s, i) => (
            <StepCard key={s.num} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const onEnter = () => gsap.to(cardRef.current, { borderColor: 'rgba(192,245,61,0.3)', duration: 0.3 })
    const onLeave = () => gsap.to(cardRef.current, { borderColor: 'rgba(30,42,10,1)',      duration: 0.3 })
    const el = cardRef.current
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <div ref={cardRef}
      className={`rounded-2xl p-6 flex flex-col gap-4 cursor-default group transition-colors
        ${index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
        ${index === 4 ? 'sm:col-span-2 lg:col-span-3' : ''}`}
      style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>

      <div className="flex items-center justify-between">
        <span className="text-lime font-black text-sm tabular-nums">{step.num}</span>
        <span className="w-2 h-2 rounded-full bg-lime/30 group-hover:bg-lime transition-colors" />
      </div>

      <h3 className="text-white font-bold text-base leading-snug group-hover:text-lime transition-colors">
        {step.title}
      </h3>

      <p className="text-white/40 text-sm leading-relaxed flex-1">{step.desc}</p>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {step.tags.map((t) => (
          <span key={t} className="text-xs text-white/40 border border-white/10 rounded-full px-2.5 py-1
            group-hover:border-lime/20 group-hover:text-lime/60 transition-colors">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
