import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, Compass, Layers, Users, CheckCircle } from 'lucide-react'
import { splitWords, splitChars } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01', Icon: Search,
    title: 'Understand Problems',
    desc: 'Identify pain points, stakeholder needs, and business objectives through discussions, PRDs, and workflow analysis.',
    tags: ['Stakeholder Alignment', 'Problem Discovery'],
  },
  {
    num: '02', Icon: Compass,
    title: 'Research & Define',
    desc: 'Map user journeys and information architecture to simplify complex systems into intuitive product flows.',
    tags: ['User Flow', 'UX Mapping'],
  },
  {
    num: '03', Icon: Layers,
    title: 'Design Solutions',
    desc: 'Create wireframes, design systems, and modular interfaces ensuring consistency and scalability across products.',
    tags: ['Wireframing', 'Design Systems'],
  },
  {
    num: '04', Icon: Users,
    title: 'Collaborate & Iterate',
    desc: 'Work closely with PMs and developers to refine solutions and align business with technical requirements.',
    tags: ['Cross-Functional', 'Iteration'],
  },
  {
    num: '05', Icon: CheckCircle,
    title: 'Validate & Improve',
    desc: 'Evaluate usability, gather feedback, and continuously improve experiences based on user behavior.',
    tags: ['Feedback Loop', 'Usability'],
  },
]

const principles = ['Simplicity', 'Scalability', 'Accessibility', 'User Trust', 'Business Impact', 'Operational Efficiency']

// Dot horizontal positions (aligned to each column center)
const DOT_POS = ['10%', '30%', '50%', '70%', '90%']

export default function DesignApproach() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const barRef     = useRef(null)
  const fillRef    = useRef(null)
  const iconRefs   = useRef([])
  const lineRefs   = useRef([])
  const dotRefs    = useRef([])
  const cardRefs   = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hST = { trigger: sectionRef.current, start: 'top 78%' }
      const bST = { trigger: barRef.current,     start: 'top 80%' }

      // Header label
      const label = headerRef.current?.querySelector('.label-tag')
      gsap.fromTo(label, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: hST })

      // h2 word reveal
      const h2 = headerRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.09, ease: 'power3.out', scrollTrigger: hST })
        gsap.from(chars, { y: '105%', stagger: 0.055, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: hST })
      }

      // Principle pills stagger
      const pills = headerRef.current?.querySelectorAll('.pill')
      if (pills?.length)
        gsap.from(pills, { opacity: 0, scale: 0.7, stagger: 0.06, duration: 0.4, ease: 'back.out(2)', scrollTrigger: hST })

      // Icons drop down
      gsap.fromTo(iconRefs.current, { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out', delay: 0.1, scrollTrigger: bST })

      // Connector lines grow down
      gsap.fromTo(lineRefs.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.35, stagger: 0.12, ease: 'power2.out', delay: 0.4, scrollTrigger: bST })

      // Bar fill sweeps left → right
      gsap.fromTo(fillRef.current, { scaleX: 0 },
        { scaleX: 1, duration: 1.8, ease: 'power2.inOut', delay: 0.5, scrollTrigger: bST })

      // Dots pop in sequentially
      gsap.set(dotRefs.current, { scale: 0 })
      dotRefs.current.forEach((dot, i) => {
        gsap.to(dot, {
          scale: 1, duration: 0.38, ease: 'back.out(2)',
          delay: 0.7 + i * 0.2,
          scrollTrigger: bST,
        })
      })

      // Cards fade up
      gsap.fromTo(cardRefs.current, { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.5, scrollTrigger: bST })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const TICKS = Array.from({ length: 30 }, (_, i) => i)

  return (
    <section id="approach" ref={sectionRef} className="relative py-24 bg-dark overflow-hidden">
      <div className="blob blob-lime w-[500px] h-[500px] top-[-80px] right-[-80px] opacity-15" />
      <div className="absolute inset-0 grid-overlay opacity-40" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <p className="label-tag mb-4">Process</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-black leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>
              <span className="text-white">My Design </span>
              <span className="font-serif italic font-semibold text-lime">Approach</span>
            </h2>
            <div className="flex flex-wrap gap-2 md:max-w-md">
              {principles.map(p => <span key={p} className="pill">{p}</span>)}
            </div>
          </div>
        </div>

        {/* ── Desktop: horizontal timeline ── */}
        <div className="hidden md:block">

          {/* Icon row */}
          <div className="flex">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div ref={el => iconRefs.current[i] = el}
                  className="w-11 h-11 rounded-full flex items-center justify-center cursor-default"
                  style={{ background: 'var(--card)', border: '1px solid rgba(192,245,61,0.22)' }}
                  onMouseEnter={e => gsap.to(e.currentTarget.querySelector('svg'), { rotation: 360, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })}
                  onMouseLeave={e => gsap.to(e.currentTarget.querySelector('svg'), { rotation: 0, duration: 0.4, ease: 'power2.inOut', overwrite: 'auto' })}>
                  <step.Icon size={16} className="text-lime" style={{ display: 'block' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Connector lines */}
          <div className="flex">
            {steps.map((_, i) => (
              <div key={i} className="flex-1 flex justify-center">
                <div ref={el => lineRefs.current[i] = el}
                  className="w-px h-5"
                  style={{ background: 'linear-gradient(to bottom, rgba(192,245,61,0.35), rgba(192,245,61,0.06))' }}
                />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div ref={barRef}
            className="relative h-11 rounded-full overflow-hidden"
            style={{ background: 'rgba(192,245,61,0.04)', border: '1px solid rgba(192,245,61,0.13)' }}>

            {/* Tick marks */}
            {TICKS.map(i => (
              <div key={i}
                className="absolute top-2 bottom-2 w-px pointer-events-none"
                style={{ left: `${(i + 1) / (TICKS.length + 1) * 100}%`, background: 'rgba(192,245,61,0.07)' }}
              />
            ))}

            {/* Animated fill */}
            <div ref={fillRef}
              className="absolute inset-y-0 left-0 w-full origin-left"
              style={{ background: 'linear-gradient(to right, rgba(192,245,61,0.20), rgba(192,245,61,0.06))' }}
            />

            {/* Dots — outer handles position, inner is GSAP target */}
            {steps.map((_, i) => (
              <div key={i}
                className="absolute top-1/2 pointer-events-none"
                style={{ left: DOT_POS[i], transform: 'translate(-50%, -50%)' }}>
                <div ref={el => dotRefs.current[i] = el}
                  className="w-[14px] h-[14px] rounded-full"
                  style={{ background: '#C0F53D', boxShadow: '0 0 10px rgba(192,245,61,0.55)' }}
                />
              </div>
            ))}
          </div>

          {/* Step cards */}
          <div className="flex gap-3 mt-5">
            {steps.map((step, i) => (
              <div key={i}
                ref={el => cardRefs.current[i] = el}
                className="flex-1 rounded-2xl p-5 flex flex-col gap-3 group transition-colors cursor-default"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => gsap.to(e.currentTarget, { borderColor: 'rgba(192,245,61,0.28)', duration: 0.25 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border').trim(), duration: 0.3 })}>
                <span className="text-lime font-black text-xs tabular-nums">{step.num}</span>
                <h3 className="text-white font-bold text-sm leading-snug">{step.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed flex-1">{step.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {step.tags.map(t => (
                    <span key={t} className="text-[10px] text-white/30 border border-white/10 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              {/* Left rail */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--card)', border: '1px solid rgba(192,245,61,0.22)' }}>
                  <step.Icon size={14} className="text-lime" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-1" style={{ background: 'rgba(192,245,61,0.12)' }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-8 flex-1">
                <span className="text-lime font-black text-xs tabular-nums block mb-1">{step.num}</span>
                <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-3">{step.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {step.tags.map(t => (
                    <span key={t} className="text-[10px] text-white/30 border border-white/10 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
