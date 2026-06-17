import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ImageWithSkeleton from './ImageWithSkeleton'
import { splitWords, splitChars } from '../utils/splitText'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

const featured = [
  // slugs match src/data/projects.js ids
  {
    id: 'rakit-ecosystem',
    label: 'Modular Digital Ecosystem',
    name: 'rakit ecosystem',
    accent: '#C0F53D',
    award: '1st Place · Kisel Innovation Award 2024',
    desc: 'A modular digital development system to accelerate the creation of scalable products — e-commerce, cooperative systems, and POS platforms — through reusable and integrated modules.',
    tags: ['Product & UX Strategy', 'Ecosystem Planning', 'UI/UX Design', 'Design System Thinking'],
    metrics: [{ val: '40%', label: 'Dev Efficiency Improved' }, { val: '3×', label: 'Faster Multi-Product Dev' }],
    images: [
      { src: '/rakit-4.jpg', alt: 'Rakit Merchandise',      bg: '#f5b800', fit: 'cover', pos: 'top', cellClass: 'row-span-2' },
      { src: '/rakit-3.jpg', alt: 'Rakit Branding',         bg: '#0a0a0a', fit: 'cover'   },
      { src: '/rakit-2.jpg', alt: 'Rakit Ecosystem Map',    bg: '#ffffff', fit: 'contain' },
    ],
  },
  {
    id: 'coopin-ecosystem',
    label: 'Integrated Cooperative Platform',
    name: 'coopin ecosystem',
    accent: '#C0F53D',
    desc: 'A web and mobile-based digital cooperative ecosystem modernizing operations through integrated financial management, membership systems, and connected digital services.',
    tags: ['Product & UX Design', 'Mobile & Web Interface', 'Cross Functional Collaboration', 'Information Architecture'],
    metrics: [{ val: '20+', label: 'Cooperatives Integrated' }, { val: '3', label: 'Platforms Connected' }],
    images: [
      { src: '/coopin-1.jpg', alt: 'CoopIn Web App',         bg: '#111111', fit: 'cover'   },
      { src: '/coopin-2.jpg', alt: 'CoopIn Supply Chain',    bg: '#ffffff', fit: 'contain' },
      { src: '/coopin-3.jpg', alt: 'CoopIn Mobile App',      bg: '#AB000E', fit: 'contain' },
      { src: '/coopin-4.jpg', alt: 'CoopIn Admin Dashboard', bg: '#ffffff', fit: 'contain' },
    ],
  },
  {
    id: 'mykisel-redesign',
    label: 'Redesigning Member Service Experience',
    name: 'mykisel redesign',
    accent: '#C0F53D',
    desc: 'A digital member service platform redesign for Telkomsel Cooperative improving accessibility, simplifying transactions, and enhancing overall member experience.',
    tags: ['UI/UX Redesign', 'User Flow Optimization', 'Feature Experience Design', 'Design System Implementation'],
    metrics: [{ val: '+20%', label: 'Active Users in 3 Months' }],
    gridCols: '1fr 2fr 1fr',
    images: [
      { src: '/mykisel-3.jpg', alt: 'MyKisel New Features', bg: '#F5FAFF', fit: 'contain', cellClass: 'row-span-2' },
      { src: '/mykisel-1.jpg', alt: 'MyKisel Old vs New',   bg: '#1A4A78', fit: 'cover', pos: 'top', colSpan: 2 },
      { src: '/mykisel-2.jpg', alt: 'MyKisel KiselMart',    bg: '#F5FAFE', fit: 'contain' },
      { src: '/mykisel-4.jpg', alt: 'MyKisel App Icon',     bg: '#234D71', fit: 'cover' },
    ],
  },
]

export default function FeaturedProjects() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const st = { trigger: sectionRef.current, start: 'top 80%' }
      const h2 = headerRef.current?.querySelector('h2')
      if (h2) {
        const words = splitWords(h2.children[0])
        const chars = splitChars(h2.children[1])
        gsap.from(words, { y: '105%', duration: 0.7, stagger: 0.09, ease: 'power3.out', scrollTrigger: st })
        gsap.from(chars, { y: '105%', stagger: 0.05, duration: 0.55, ease: 'back.out(2.5)', scrollTrigger: st })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden" style={{ background: 'var(--card)' }}>
      <div className="blob blob-lime w-[500px] h-[500px] bottom-0 left-[-100px] opacity-20" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div ref={headerRef} className="mb-16">
          <h2 className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">Featured </span>
            <span className="font-serif italic font-semibold text-lime">Projects</span>
          </h2>
        </div>

        <div className="space-y-6">
          {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project: p }) {
  const { theme }  = useTheme()
  const cardRef    = useRef(null)
  const metricRefs = useRef([])
  const borderRef  = useRef(null)
  const isFine     = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const navigate   = useNavigate()

  const limeHover = () =>
    document.documentElement.dataset.theme === 'light'
      ? 'rgba(92,138,0,0.55)'
      : 'rgba(192,245,61,0.3)'

  const limeBorder = theme === 'light' ? 'rgba(92,138,0,0.18)' : 'rgba(192,245,61,0.18)'
  borderRef.current = limeBorder

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      gsap.fromTo(cardRef.current, { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 84%' } })

      // Counter animation for numeric metrics
      p.metrics.forEach((m, i) => {
        const el = metricRefs.current[i]
        if (!el) return
        const match = m.val.match(/(\d+\.?\d*)/)
        if (!match) return
        const num = parseFloat(match[1])
        const idx = m.val.indexOf(match[1])
        const prefix = m.val.slice(0, idx)
        const suffix = m.val.slice(idx + match[1].length)
        const obj = { val: 0 }
        gsap.to(obj, {
          val: num,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = prefix + Math.round(obj.val) + suffix },
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  const limeGlow = () =>
    document.documentElement.dataset.theme === 'light'
      ? '0 0 40px rgba(92,138,0,0.12)'
      : '0 0 40px rgba(192,245,61,0.18)'

  const onMouseEnter = () =>
    gsap.to(cardRef.current, {
      borderColor: limeHover(),
      y: -4,
      boxShadow: limeGlow(),
      duration: 0.3,
      overwrite: 'auto',
    })

  const onMouseLeave = () =>
    gsap.to(cardRef.current, {
      borderColor: borderRef.current,
      y: 0,
      boxShadow: 'none',
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    })

  const onMouseMove = (e) => {
    if (!isFine.current) return
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    gsap.to(cardRef.current, {
      rotateY: x * 2.5, rotateX: -y * 2.5,
      transformPerspective: 1200,
      duration: 0.4, ease: 'power2.out', overwrite: 'auto',
    })
  }

  return (
    <div ref={cardRef}
      data-cursor="view"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className="rounded-2xl overflow-hidden transition-all group"
      style={{ background: 'var(--card)', border: `1px solid ${limeBorder}` }}>

      <div className="p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-tag" style={{ fontSize: '0.55rem' }}>{p.label}</span>
              {p.award && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(192,245,61,0.1)', color: 'var(--lime-text)', border: '1px solid rgba(192,245,61,0.25)' }}>
                  ✦ {p.award}
                </span>
              )}
            </div>

            <h3 className="font-sans font-bold text-lime leading-tight capitalize"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
              {p.name}
            </h3>

            <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>

            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => <span key={t} className="pill">{t}</span>)}
            </div>

            <button onClick={() => navigate(`/projects/${p.id}`)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-lime hover:text-lime/70 transition-colors group/btn">
              View Case Study
              <ArrowUpRight size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Right — visual + metrics */}
          <div className="space-y-5">
            {/* Visual */}
            {p.images ? (
              <div
                className="w-full aspect-video rounded-xl overflow-hidden gap-1"
                style={{
                  background: 'var(--bg)',
                  display: 'grid',
                  gridTemplateColumns: p.gridCols || '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                }}>
                {p.images.map((img, idx) => (
                  <div key={idx}
                    className={`overflow-hidden relative flex items-center justify-center ${img.cellClass || ''}`}
                    style={{
                      background: img.bg || 'var(--bg)',
                      ...(img.colSpan ? { gridColumn: `span ${img.colSpan}` } : {}),
                    }}>
                    <ImageWithSkeleton
                      src={img.src}
                      alt={img.alt}
                      imgClassName={`w-full h-full transition-transform duration-500 group-hover:scale-105
                        ${img.fit === 'cover'   ? 'object-cover'   : 'object-contain'}
                        ${img.pos === 'top'     ? 'object-top'     : ''}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{ background: 'var(--medium)' }}>
                <div className="blob blob-lime w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="relative text-center space-y-2">
                  <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center text-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {p.emoji}
                  </div>
                  <p className="text-white/20 text-xs font-serif italic">{p.name}</p>
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className={`grid gap-3 ${p.metrics.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {p.metrics.map((m, i) => (
                <div key={m.label}
                  className="rounded-xl p-4 text-center"
                  style={{ background: 'var(--medium)', border: '1px solid var(--border)' }}>
                  <p ref={el => metricRefs.current[i] = el} className="text-lime font-black text-xl leading-none mb-1">{m.val}</p>
                  <p className="text-white/30 text-xs leading-tight">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
