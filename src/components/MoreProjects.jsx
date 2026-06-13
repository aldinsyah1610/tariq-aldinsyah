import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus } from 'lucide-react'
import ImageWithSkeleton from './ImageWithSkeleton'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { name: 'BayarAja',           desc: 'Digital payment app simplifying daily transactions through intuitive UX.', tags: ['UI Redesign', 'UX Flow', 'System Design'],        img: '/more-3.jpg', bg: '#EEF7FF' },
  { name: 'BayarAja Canvasser', desc: 'Field sales app streamlining canvassing and improving team productivity.',  tags: ['Workflow Design', 'UI Design', 'UX Optimization'], img: '/more-5.jpg', bg: '#D1D3D8' },
  { name: 'BayarAja POS',       desc: 'Mobile POS for MSMEs — transactions, products, sales reports.',            tags: ['UI Design', 'System Design', 'UX Strategy'],       img: '/more-9.jpg', bg: '#DEEFFF' },
  { name: 'Marissa HRIS',       desc: 'HR management system improving employee operations and engagement.',        tags: ['UI Redesign', 'UX Optimization', 'System Design'],  img: '/more-2.jpg', bg: '#DEEFFF' },
  { name: 'iFMC',               desc: 'HRIS and network operation system for field workforce management.',         tags: ['System Design', 'UI Design', 'UX Strategy'],       img: '/more-4.jpg', bg: '#DEEFFF' },
  { name: 'Dira Help Desk',     desc: 'Integrated help desk for KISEL subsidiaries — streamlined requests.',      tags: ['UI Design', 'Workflow Design', 'System Design'],    img: '/more-6.jpg', bg: '#EEF7FF' },
  { name: 'Nexus Care',         desc: 'Nursing documentation platform standardizing care and diagnosis.',         tags: ['UI Design', 'UX Strategy', 'Platform Design'],      img: '/more-7.jpg', bg: '#EEF7FF' },
  { name: 'Selynar OMS',        desc: 'Supply chain order management for Telkomsel warehouse distribution.',      tags: ['Product Design', 'UX Strategy', 'UI Design'],       img: '/more-8.jpg', bg: '#EEF7FF' },
]

export default function MoreProjects() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
      gsap.fromTo(gridRef.current?.children, { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="more-projects" className="relative py-24 bg-dark overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="blob blob-lime w-[400px] h-[400px] top-0 right-[-80px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={headerRef} className="mb-16">
          <p className="label-tag mb-4">More Work</p>
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>
            <span className="text-white">We Help Companies </span>
            <span className="font-serif italic font-semibold text-lime">Grow</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((p) => <ProjectItem key={p.name} project={p} />)}
        </div>
      </div>
    </section>
  )
}

function ProjectItem({ project: p }) {
  const cardRef = useRef(null)

  const onMouseEnter = () =>
    gsap.to(cardRef.current, { borderColor: 'rgba(192,245,61,0.3)', y: -4, duration: 0.25, ease: 'power2.out' })

  const onMouseLeave = () =>
    gsap.to(cardRef.current, {
      borderColor: 'rgba(30,42,10,1)', y: 0,
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.5, ease: 'power2.out',
    })

  const onMouseMove = (e) => {
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    gsap.to(cardRef.current, { rotateY: x * 8, rotateX: -y * 8, scale: 1.02, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <div ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{ background: '#0f1505', border: '1px solid #1e2a0a' }}>

      {/* Thumbnail */}
      <div className="w-full aspect-square overflow-hidden relative" style={{ background: p.bg }}>
        <ImageWithSkeleton
          src={p.img}
          alt={p.name}
          imgClassName="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold group-hover:text-lime transition-colors">{p.name}</h3>
          <Plus size={16} className="text-white/20 group-hover:text-lime transition-colors mt-0.5 shrink-0 ml-2" />
        </div>
        <p className="text-white/35 text-sm leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => <span key={t} className="pill text-xs">{t}</span>)}
        </div>
      </div>
    </div>
  )
}
