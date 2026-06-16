import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
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
  const listRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const st  = { trigger: sectionRef.current, start: 'top 80%' }
      const lst = { trigger: listRef.current, start: 'top 85%' }
      const h2  = headerRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.75, stagger: 0.09, ease: 'power3.out', scrollTrigger: st })
        gsap.from(chars, { y: '105%', scale: 0.6, stagger: 0.07, duration: 0.6, ease: 'back.out(3)', scrollTrigger: st })
      }

      gsap.fromTo(listRef.current?.children, { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.15, scrollTrigger: lst })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="more-projects" className="relative py-20 bg-dark overflow-hidden" ref={sectionRef}>
      <div className="blob blob-lime w-[400px] h-[400px] top-0 right-[-80px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={headerRef} className="mb-12">
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">We Help Companies </span>
            <span className="font-serif italic font-semibold text-lime">Grow</span>
          </h2>
        </div>

        <div ref={listRef} style={{ borderTop: '1px solid var(--border)' }}>
          {projects.map((p, i) => <ProjectRow key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function ProjectRow({ project: p, index }) {
  const rowRef   = useRef(null)
  const thumbRef = useRef(null)
  const navigate = useNavigate()

  const limeText = () => document.documentElement.dataset.theme === 'light' ? '#5C8A00' : '#C0F53D'

  const onMouseEnter = () => {
    gsap.to(rowRef.current, { backgroundColor: 'var(--medium)', borderLeftColor: limeText(), duration: 0.2, ease: 'power2.out' })
    gsap.to(thumbRef.current, { scale: 1.06, duration: 0.3, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    gsap.to(rowRef.current, { backgroundColor: 'transparent', borderLeftColor: 'transparent', duration: 0.35, ease: 'power2.out' })
    gsap.to(thumbRef.current, { scale: 1, duration: 0.35, ease: 'power2.out' })
  }

  return (
    <div ref={rowRef}
      data-cursor="view"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => navigate(`/projects/${p.id}`)}
      className="cursor-pointer flex items-center gap-5 sm:gap-6 py-4 px-3 rounded-lg"
      style={{ borderBottom: '1px solid var(--border)', borderLeft: '2px solid transparent' }}>

      {/* Index */}
      <span className="text-white/20 font-mono text-xs w-6 shrink-0 select-none">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Thumbnail */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: p.bg }}>
        <div ref={thumbRef} className="w-full h-full">
          <ImageWithSkeleton
            src={p.img}
            alt={p.name}
            imgClassName="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Name + desc */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm sm:text-base leading-tight group-hover:text-lime transition-colors truncate">
          {p.name}
        </p>
        <p className="text-white/30 text-xs mt-0.5 leading-snug line-clamp-1 hidden sm:block">{p.desc}</p>
      </div>

      {/* Tags (md+ only) */}
      <div className="hidden lg:flex flex-wrap gap-1.5 max-w-xs justify-end shrink-0">
        {p.tags.slice(0, 2).map((t) => (
          <span key={t} className="pill text-xs">{t}</span>
        ))}
      </div>

      {/* Arrow */}
      <ArrowUpRight size={15} className="shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--text-40)' }} />
    </div>
  )
}
