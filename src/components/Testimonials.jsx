import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    quote: 'Redesign MyKisel melampaui ekspektasi kami. Navigasi lebih bersih, onboarding lebih cepat, dan anggota koperasi merespons sangat positif terhadap pengalaman baru yang jauh lebih user friendly.',
    author: 'Ifan Ramadhan',
    role: 'Member Service',
    company: 'Kisel Group',
    avatar: null,
    featured: false,
  },
  {
    quote: 'Kolaborasi dengan Tariq sangat mulus. Ia memahami keterbatasan teknis sekaligus kebutuhan pengguna, dan menghasilkan design system yang benar-benar bisa diimplementasikan oleh tim engineering secara efisien.',
    author: 'Dany Sentiana',
    role: 'Frontend Engineer',
    company: 'Kisel Group',
    avatar: null,
    featured: false,
  },
  {
    quote: 'Tariq memiliki kemampuan luar biasa untuk menerjemahkan kebutuhan bisnis yang kompleks menjadi antarmuka yang intuitif. Rakit Ecosystem mengubah cara kami membangun produk secara fundamental — lebih cepat, lebih konsisten, dan lebih scalable.',
    author: 'Dimas Erlangga Putera',
    role: 'IT Business Solution Supervisor',
    company: 'Kisel Group',
    avatar: null,
    featured: true,
  },
]

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}

export default function Testimonials() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const cardRefs   = useRef([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) return

      const st = { trigger: sectionRef.current, start: 'top 80%' }

      // Heading: clip-path wipe left→right, subtitle fades from right
      const h2 = headRef.current?.querySelector('h2')
      const sub = headRef.current?.querySelector('p')
      if (h2)
        gsap.fromTo(h2,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power3.inOut', scrollTrigger: st })
      if (sub)
        gsap.fromTo(sub,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: 'power2.out', scrollTrigger: st })

      // Cards: scale + pop-expand instead of plain fade-up
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 44, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: 'back.out(1.25)',
          stagger: { amount: 0.38, from: 'start' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const { theme } = useTheme()
  const lime = (a) => theme === 'light' ? `rgba(92,138,0,${a})` : `rgba(192,245,61,${a})`

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const cardHover = (t) => canHover ? {
    onMouseEnter: (e) => gsap.to(e.currentTarget, {
      y: -4,
      boxShadow: t.featured ? `0 0 60px ${lime(0.28)}` : `0 0 30px ${lime(0.12)}`,
      duration: 0.25, ease: 'power2.out', overwrite: 'auto',
    }),
    onMouseLeave: (e) => gsap.to(e.currentTarget, {
      y: 0,
      boxShadow: t.featured ? `0 0 40px ${lime(0.18)}` : 'none',
      duration: 0.4, ease: 'power2.out', overwrite: 'auto',
    }),
  } : {}

  return (
    <section ref={sectionRef} id="testimonials" className="relative py-24 bg-dark overflow-hidden">

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
                border: t.featured ? `1px solid ${lime(0.35)}` : '1px solid var(--border)',
                boxShadow: t.featured ? `0 0 40px ${lime(0.18)}` : 'none',
                willChange: 'transform',
              }}
              {...cardHover(t)}
            >
              {/* Decorative quote mark */}
              <div
                className="font-serif select-none mb-5"
                style={{ fontSize: '3.5rem', lineHeight: 0.8, color: 'var(--lime-text)', opacity: 0.55 }}
              >
                "
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1"
                style={{ color: 'var(--text-70)' }}>
                {t.quote}
              </p>

              {/* Author */}
              <div className="mt-6 pt-5 flex items-center gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.author} className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                    style={{ background: 'var(--lime-text)', color: 'var(--bg)' }}
                  >
                    {getInitials(t.author)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text)' }}>
                    {t.author}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-40)' }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
