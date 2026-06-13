import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download } from 'lucide-react'
import ImageWithSkeleton from './ImageWithSkeleton'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const metaRef      = useRef(null)
  const line1Ref     = useRef(null)
  const line2Ref     = useRef(null)
  const descRef      = useRef(null)
  const ctaRef       = useRef(null)
  const phoneWrapRef = useRef(null)
  const phoneRef     = useRef(null)
  const viewBtnRef   = useRef(null)
  const aboutBtnRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl
        .fromTo(metaRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        .fromTo(line1Ref.current, { y: '120%' },          { y: '0%',  duration: 1.1, ease: 'power4.out' }, '-=0.1')
        .fromTo(line2Ref.current, { y: '120%' },          { y: '0%',  duration: 1.1, ease: 'power4.out' }, '-=0.75')
        .fromTo(descRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .fromTo(ctaRef.current,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
        .fromTo(phoneWrapRef.current, { opacity: 0, x: 60, scale: 0.93 }, { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.85')

      // Float loop on inner phone div
      gsap.to(phoneRef.current, {
        y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5,
      })

      // Scroll parallax on phone wrapper
      gsap.to(phoneWrapRef.current, {
        y: -55, ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: '+=600',
          scrub: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  const magnetic = (ref) => ({
    onMouseMove: (e) => {
      const r = ref.current.getBoundingClientRect()
      gsap.to(ref.current, {
        x: (e.clientX - r.left - r.width  / 2) * 0.38,
        y: (e.clientY - r.top  - r.height / 2) * 0.38,
        duration: 0.3, ease: 'power2.out',
      })
    },
    onMouseLeave: () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }),
  })

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-dark pt-16">
      <div className="absolute inset-0 grid-overlay opacity-60" />

      <span className="sparkle absolute top-24 left-[8%] text-lg select-none">+</span>
      <span className="sparkle absolute top-32 right-[8%] text-base select-none">+</span>
      <span className="sparkle absolute bottom-32 left-[20%] text-base select-none">+</span>
      <span className="sparkle absolute bottom-24 right-[25%] text-lg select-none">✦</span>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-8 lg:py-10 w-full">

        <div ref={metaRef} className="grid grid-cols-3 gap-4 mb-8 lg:mb-14 border-b border-[#1e2a0a] pb-6 lg:pb-8 text-sm">
          <div>
            <p className="text-white/30 uppercase text-xs tracking-widest mb-1">Designer</p>
            <p className="text-white/70 font-medium text-xs sm:text-sm">Tariq Aldinsyah</p>
          </div>
          <div>
            <p className="text-white/30 uppercase text-xs tracking-widest mb-1">Services</p>
            <p className="text-white/70 font-medium text-xs sm:text-sm">UI/UX Design, Product Strategy</p>
          </div>
          <div>
            <p className="text-white/30 uppercase text-xs tracking-widest mb-1">Year</p>
            <p className="text-white/70 font-medium text-xs sm:text-sm">2026</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12" style={{ alignItems: 'start' }}>

          <div>
            <div className="mb-6 lg:mb-10">
              <h1 className="font-sans font-black leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 4.2rem)' }}>

                <span className="block overflow-hidden">
                  <span ref={line1Ref} className="block">
                    <span className="text-white">Building Scalable </span>
                    <span className="font-serif italic font-semibold"
                      style={{
                        fontSize: '0.9em',
                        background: 'linear-gradient(135deg, #C0F53D 0%, #6fa818 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>Digital Ecosystem</span>
                  </span>
                </span>

                <span className="block overflow-hidden">
                  <span ref={line2Ref} className="block">
                    <span className="text-white">& User-Centered Products</span>
                  </span>
                </span>

              </h1>
            </div>

            <div ref={descRef} className="mb-6 lg:mb-10">
              <p className="text-white/50 text-base leading-relaxed">
                <span className="text-white font-semibold">I'm</span>{' '}
                <span className="font-serif italic text-white/70">a UI/UX Product Designer</span>{' '}
                focused on building scalable digital ecosystems{' '}
                <span className="font-serif italic text-white/70">that bridge</span>{' '}
                business goals with meaningful user experiences.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <a ref={viewBtnRef}
                {...magnetic(viewBtnRef)}
                href="/tariq-cv.pdf"
                download="Tariq_Aldinsyah_CV.pdf"
                className="inline-flex items-center gap-2 bg-lime text-dark font-bold px-7 py-3 rounded-full text-sm tracking-wide hover:bg-lime-dark transition-colors shadow-lime-glow">
                <Download size={15} />
                Download CV
              </a>
              <button ref={aboutBtnRef}
                {...magnetic(aboutBtnRef)}
                onClick={() => { const el = document.querySelector('#about'); if (window.__lenis) window.__lenis.scrollTo(el); else el?.scrollIntoView({ behavior: 'smooth' }) }}
                className="border border-white/20 text-white/70 font-medium px-7 py-3 rounded-full text-sm tracking-wide hover:border-lime/40 hover:text-lime transition-all">
                About Me
              </button>
            </div>
          </div>

          <div ref={phoneWrapRef} className="flex items-center justify-center overflow-hidden"
            style={{ alignSelf: 'stretch' }}>
            <div ref={phoneRef} className="w-full relative" style={{ maxHeight: '480px' }}>
              <ImageWithSkeleton
                src="/phone-mockup.jpg"
                alt="MyKisel app interface"
                imgClassName="w-full object-contain object-top"
                style={{ borderRadius: '20px', maxHeight: '480px' }}
              />
            </div>
          </div>

        </div>

        <div className="mt-16 pt-6 border-t border-[#1e2a0a] flex items-center justify-between text-white/20 text-xs tracking-widest uppercase">
          <span>UI/UX Portfolio</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
            Available for work
          </span>
        </div>
      </div>
    </section>
  )
}
