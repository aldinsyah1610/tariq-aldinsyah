import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Replace quotes and author details with real testimonials
const TESTIMONIALS = [
  {
    quote: 'Tariq memiliki kemampuan luar biasa untuk menerjemahkan kebutuhan bisnis yang kompleks menjadi antarmuka yang intuitif. Rakit Ecosystem mengubah cara kami membangun produk secara fundamental — lebih cepat, lebih konsisten, dan lebih scalable.',
    author: '[Nama Atasan]',
    role: 'Product Manager',
    company: 'Kisel Group',
    featured: true,
  },
  {
    quote: 'Kolaborasi dengan Tariq sangat mulus. Ia memahami keterbatasan teknis sekaligus kebutuhan pengguna, dan menghasilkan design system yang benar-benar bisa diimplementasikan oleh tim engineering secara efisien.',
    author: '[Nama Rekan]',
    role: 'Frontend Engineer',
    company: 'Kisel Group',
    featured: false,
  },
  {
    quote: 'Redesign MyKisel melampaui ekspektasi kami. Navigasi lebih bersih, onboarding lebih cepat, dan anggota koperasi merespons sangat positif terhadap pengalaman baru yang jauh lebih user-friendly.',
    author: '[Nama Stakeholder]',
    role: 'Operations Lead',
    company: 'Telkomsel Koperasi',
    featured: false,
  },
]

export default function Testimonials() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const cardRefs   = useRef([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) return

      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="testimonials" className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

        {/* Heading */}
        <div ref={headRef} className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h2 className="font-black leading-[1.0] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            <span className="text-white">What People </span>
            <span className="font-serif italic font-semibold text-lime">Say</span>
          </h2>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-40)' }}>
            From colleagues and stakeholders who've experienced the work firsthand.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="rounded-2xl p-6 sm:p-8 flex flex-col"
              style={{
                background: 'var(--card)',
                border: t.featured ? '1px solid rgba(192,245,61,0.18)' : '1px solid var(--border)',
              }}
            >
              {/* Decorative quote mark */}
              <div
                className="font-serif select-none mb-5"
                style={{ fontSize: '3.5rem', lineHeight: 0.8, color: 'var(--lime-text)', opacity: 0.55 }}
              >
                "
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1 font-serif italic"
                style={{ color: 'var(--text-70)' }}>
                {t.quote}
              </p>

              {/* Author */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text)' }}>
                  {t.author}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-40)' }}>
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
