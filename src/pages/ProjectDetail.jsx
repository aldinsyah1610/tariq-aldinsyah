import { useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, Calendar, Building2, User } from 'lucide-react'
import { getProjectById, getNextProject } from '../data/projects'
import ImageWithSkeleton from '../components/ImageWithSkeleton'
import Navbar from '../components/Navbar'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id)
  const next = project ? getNextProject(id) : null

  const heroRef    = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [id])

  useEffect(() => {
    if (!project) return
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 })

      gsap.fromTo('.pd-section', { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } })
    })
    return () => ctx.revert()
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">Project not found.</p>
        <Link to="/" className="text-lime text-sm hover:underline">← Back to Portfolio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="blob blob-lime w-[600px] h-[600px] top-[-100px] right-[-100px] opacity-15" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

          {/* Back nav */}
          <button onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white/40 hover:text-lime text-sm mb-10 transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: meta */}
            <div>
              <p className="label-tag mb-4">{project.label}</p>
              <h1 className="font-black leading-[1.05] tracking-tight capitalize mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                <span style={{ color: 'var(--text)' }}>{project.name}</span>
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'var(--medium)', border: '1px solid var(--border)', color: 'var(--text-60)' }}>
                  <Calendar size={11} /> {project.year}
                </span>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'var(--medium)', border: '1px solid var(--border)', color: 'var(--text-60)' }}>
                  <Building2 size={11} /> {project.company}
                </span>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'var(--medium)', border: '1px solid var(--border)', color: 'var(--text-60)' }}>
                  <User size={11} /> {project.role}
                </span>
              </div>

              <p style={{ color: 'var(--text-60)', lineHeight: '1.7', fontSize: '1rem' }}>
                {project.overview}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {project.tags.map(t => <span key={t} className="pill">{t}</span>)}
              </div>
            </div>

            {/* Right: hero image */}
            <div className="rounded-2xl overflow-hidden" style={{ background: project.heroImage.bg, minHeight: 320 }}>
              <ImageWithSkeleton
                src={project.heroImage.src}
                alt={project.name}
                imgClassName={`w-full h-full ${project.heroImage.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                style={{ maxHeight: 420 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 space-y-20">

        {/* My Role */}
        <div className="pd-section">
          <SectionLabel>My Role</SectionLabel>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <InfoCard icon={<User size={14} />} label="Role" value={project.role} />
            <InfoCard icon={<Building2 size={14} />} label="Company" value={project.company} />
            <InfoCard icon={<Calendar size={14} />} label="Duration" value={project.duration} />
          </div>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--text-60)' }}>
            {project.myRole}
          </p>
        </div>

        {/* Problem → Solution */}
        <div className="pd-section">
          <SectionLabel>Challenge & Solution</SectionLabel>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl p-7" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="label-tag mb-4" style={{ color: 'var(--text-40)' }}>Problem</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-60)' }}>{project.problem}</p>
            </div>
            <div className="rounded-2xl p-7"
              style={{ background: 'var(--card)', border: '1px solid rgba(192,245,61,0.2)' }}>
              <p className="label-tag mb-4">Solution</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-60)' }}>{project.solution}</p>
            </div>
          </div>
        </div>

        {/* Design Process */}
        <div className="pd-section">
          <SectionLabel>Design Process</SectionLabel>
          <div className="mt-6">
            {/* Desktop: horizontal */}
            <div className="hidden md:flex gap-3">
              {project.process.map((step, i) => (
                <div key={i} className="flex-1 rounded-2xl p-5 flex flex-col gap-2"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <span className="text-lime font-black text-xs tabular-nums">{step.num}</span>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{step.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-40)' }}>{step.desc}</p>
                </div>
              ))}
            </div>
            {/* Mobile: vertical */}
            <div className="md:hidden space-y-3">
              {project.process.map((step, i) => (
                <div key={i} className="flex gap-4 items-start rounded-xl p-4"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <span className="text-lime font-black text-xs tabular-nums shrink-0 mt-0.5">{step.num}</span>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{step.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-40)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="pd-section">
          <SectionLabel>Key Features</SectionLabel>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {project.features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'rgba(192,245,61,0.12)', border: '1px solid rgba(192,245,61,0.2)' }}>
                  <span className="text-lime font-black text-xs">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>{f.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-40)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="pd-section">
            <SectionLabel>Project Gallery</SectionLabel>
            <div className={`mt-6 grid gap-3 ${project.gallery.length === 1 ? 'grid-cols-1' : project.gallery.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {project.gallery.map((img, i) => (
                <div key={i}
                  className={`rounded-xl overflow-hidden ${i === 0 && project.gallery.length >= 3 ? 'col-span-2 md:col-span-2' : ''}`}
                  style={{ background: img.bg, minHeight: 220 }}>
                  <ImageWithSkeleton
                    src={img.src}
                    alt={img.alt}
                    imgClassName={`w-full h-full ${img.fit === 'contain' ? 'object-contain p-4' : 'object-cover'}`}
                    style={{ minHeight: 220 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact */}
        <div className="pd-section">
          <SectionLabel>Impact & Results</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {project.metrics.map((m, i) => (
              <div key={i} className="rounded-2xl p-6 text-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <p className="text-lime font-black text-2xl leading-none mb-2">{m.val}</p>
                <p className="text-xs leading-tight" style={{ color: 'var(--text-30)' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Project */}
        {next && (
          <div className="pd-section">
            <div className="h-px mb-12" style={{ background: 'var(--border)' }} />
            <p className="label-tag mb-6">Next Project</p>
            <Link to={`/projects/${next.id}`}
              className="group flex items-center justify-between rounded-2xl p-8 transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,245,61,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()}>
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-30)' }}>{next.label}</p>
                <h3 className="font-bold text-xl capitalize" style={{ color: 'var(--text)' }}>{next.name}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:bg-lime group-hover:text-dark"
                style={{ border: '1px solid var(--border)', color: 'var(--text-40)' }}>
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-5 rounded-full bg-lime" />
      <p className="label-tag">{children}</p>
    </div>
  )
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--lime-text)' }}>
        {icon}
        <span className="label-tag" style={{ fontSize: '0.6rem' }}>{label}</span>
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</p>
    </div>
  )
}
