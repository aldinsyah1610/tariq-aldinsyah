import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ImageWithSkeleton from './ImageWithSkeleton'
import { splitWords, splitChars } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { id: 'bayaraja',           name: 'BayarAja',           desc: 'Digital payment app simplifying daily transactions through intuitive UX.', tags: ['UI Redesign', 'UX Flow', 'System Design'],        img: '/more-bayaraja.jpg',   bg: '#C8D8C8' },
  { id: 'bayaraja-canvasser', name: 'BayarAja Canvasser', desc: 'Field sales app streamlining canvassing and improving team productivity.',  tags: ['Workflow Design', 'UI Design', 'UX Optimization'], img: '/more-canvasser.jpg',  bg: '#C8D8C8' },
  { id: 'bayaraja-pos',       name: 'BayarAja POS',       desc: 'Mobile POS for MSMEs — transactions, products, sales reports.',            tags: ['UI Design', 'System Design', 'UX Strategy'],       img: '/more-pos.jpg',        bg: '#C8D8C8' },
  { id: 'marissa-hris',       name: 'Marissa HRIS',       desc: 'HR management system improving employee operations and engagement.',        tags: ['UI Redesign', 'UX Optimization', 'System Design'],  img: '/more-marissa.jpg',    bg: '#C8D8C8' },
  { id: 'ifmc',               name: 'iFMC',               desc: 'HRIS and network operation system for field workforce management.',         tags: ['System Design', 'UI Design', 'UX Strategy'],       img: '/more-ifmc.jpg',       bg: '#C8D8C8' },
  { id: 'dira-helpdesk',      name: 'Dira Help Desk',     desc: 'Integrated help desk for KISEL subsidiaries — streamlined requests.',      tags: ['UI Design', 'Workflow Design', 'System Design'],    img: '/more-dira.jpg',       bg: '#C8D8C8' },
  { id: 'nexus-care',         name: 'Nexus Care',         desc: 'Nursing documentation platform standardizing care and diagnosis.',         tags: ['UI Design', 'UX Strategy', 'Platform Design'],      img: '/more-nexus.jpg',      bg: '#C8D8C8' },
  { id: 'selynar-oms',        name: 'Selynar OMS',        desc: 'Supply chain order management for Telkomsel warehouse distribution.',      tags: ['Product Design', 'UX Strategy', 'UI Design'],       img: '/more-selynar.jpg',    bg: '#C8D8C8' },
]

export default function MoreProjects() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st  = { trigger: sectionRef.current, start: 'top 80%' }
      const gst = { trigger: gridRef.current, start: 'top 85%' }
      const h2  = headerRef.current?.querySelector('h2')
      const label = headerRef.current?.querySelector('.label-tag')

      // Label
      gsap.fromTo(label, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: st })

      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.75, stagger: 0.09, ease: 'power3.out', scrollTrigger: st })
        // "Grow" chars bounce in with elastic
        gsap.from(chars, { y: '105%', scale: 0.6, stagger: 0.07, duration: 0.6, ease: 'back.out(3)', scrollTrigger: st })
      }

      // Grid cards
      gsap.fromTo(gridRef.current?.children, { opacity: 0, y: 32, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.2, scrollTrigger: gst })
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
  const cardRef    = useRef(null)
  const borderRef  = useRef(null)
  const navigate   = useNavigate()

  useEffect(() => {
    borderRef.current = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
  }, [])

  const onMouseEnter = () =>
    gsap.to(cardRef.current, { borderColor: 'rgba(192,245,61,0.3)', y: -4, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })

  const onMouseLeave = () =>
    gsap.to(cardRef.current, {
      borderColor: borderRef.current, y: 0,
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.5, ease: 'power2.out', overwrite: 'auto',
    })

  const onMouseMove = (e) => {
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    gsap.to(cardRef.current, { rotateY: x * 8, rotateX: -y * 8, scale: 1.02, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
  }

  return (
    <div ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={() => navigate(`/projects/${p.id}`)}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

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
