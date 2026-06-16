import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download } from 'lucide-react'
import ImageWithSkeleton from './ImageWithSkeleton'
import GradientBars from './GradientBars'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const metaRef      = useRef(null)
  const line1Ref     = useRef(null)
  const line2Ref     = useRef(null)
  const italicRef    = useRef(null)
  const descRef      = useRef(null)
  const ctaRef       = useRef(null)
  const phoneWrapRef = useRef(null)
  const phoneRef     = useRef(null)
  const viewBtnRef   = useRef(null)
  const aboutBtnRef  = useRef(null)
  const sectionRef   = useRef(null)

  useEffect(() => {
    let ctx

    const startAnim = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      ctx = gsap.context(() => {
        if (prefersReduced) {
          gsap.set(italicRef.current, { clipPath: 'inset(0 0% 0 0)' })
          gsap.set([metaRef.current, line1Ref.current, line2Ref.current, descRef.current, ctaRef.current, phoneWrapRef.current], { opacity: 1, y: 0, x: 0, scale: 1 })
          return
        }

        const isMobile = window.innerWidth < 768

        if (isMobile) {
          // On mobile, skip heavy y/clipPath transforms — just fade everything in.
          // Complex transforms stall on mobile GPU and can leave content invisible.
          const els = [metaRef.current, line1Ref.current, italicRef.current, line2Ref.current, descRef.current, ctaRef.current, phoneWrapRef.current].filter(Boolean)
          gsap.set(els, { opacity: 0 })
          gsap.to(els, { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.15 })
          gsap.set(italicRef.current, { clipPath: 'inset(0 0% 0 0)' })
          return
        }

        gsap.set(italicRef.current, { clipPath: 'inset(0 100% 0 0)' })

        const tl = gsap.timeline({ delay: 0.2 })
        tl
          .fromTo(metaRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          .fromTo(line1Ref.current, { y: '120%' },          { y: '0%',  duration: 1.0, ease: 'power4.out' }, '-=0.1')
          .to(italicRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power3.inOut' }, '-=0.1')
          .fromTo(line2Ref.current, { y: '120%' },          { y: '0%',  duration: 1.0, ease: 'power4.out' }, '-=0.55')
          .fromTo(descRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
          .fromTo(ctaRef.current,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
          .fromTo(phoneWrapRef.current, { opacity: 0, x: 60, scale: 0.93 }, { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.85')

        const sparkles = sectionRef.current?.querySelectorAll('.sparkle')
        if (sparkles?.length)
          gsap.from(sparkles, { scale: 0.88, opacity: 0, rotation: -45, stagger: 0.15, duration: 0.6, ease: 'back.out(2)', delay: 1.0 })

        // Enter + settle: one gentle dip then hold (no infinite loop)
        gsap.to(phoneRef.current, {
          y: -8, duration: 0.9, ease: 'sine.inOut', delay: 1.5,
          onComplete: () => gsap.to(phoneRef.current, { y: 0, duration: 0.7, ease: 'sine.inOut' }),
        })

        gsap.to(phoneWrapRef.current, {
          y: -55, ease: 'none',
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: '+=600', scrub: 1 },
        })
      })
    }

    if (window.__preloaderDone) startAnim()
    else window.addEventListener('preloader-done', startAnim, { once: true })

    return () => {
      window.removeEventListener('preloader-done', startAnim)
      ctx?.revert()
    }
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
    <section ref={sectionRef} className="relative flex flex-col justify-center overflow-hidden bg-dark pt-16 sm:min-h-[90vh]">
      <GradientBars />
      <div className="absolute inset-0 grid-overlay opacity-15" />

      <span className="sparkle absolute top-24 left-[8%] text-lg select-none">+</span>
      <span className="sparkle absolute top-32 right-[8%] text-base select-none">+</span>
      <span className="sparkle absolute bottom-32 left-[20%] text-base select-none">+</span>
      <span className="sparkle absolute bottom-24 right-[25%] text-lg select-none">✦</span>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-20 w-full">

        <div ref={metaRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 lg:mb-16 border-b border-[#1e2a0a] pb-6 lg:pb-8 text-sm">
          <div>
            <p className="text-white/30 uppercase text-xs tracking-widest mb-1">Designer</p>
            <p className="text-white/70 font-medium text-xs sm:text-sm">Tariq Aldinsyah</p>
          </div>
          <div className="hidden sm:block">
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
              <h1 className="font-sans font-black leading-[1.0] tracking-tight"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.8rem)' }}>

                <span className="block overflow-hidden">
                  <span ref={line1Ref} className="block">
                    <span className="text-white">Building Scalable </span>
                    <span ref={italicRef} className="font-serif italic font-semibold text-lime"
                      style={{ fontSize: '0.9em', display: 'inline-block' }}>Digital Ecosystem</span>
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

          <div ref={phoneWrapRef} className="relative overflow-hidden"
            style={{ alignSelf: 'stretch' }}>
            <div ref={phoneRef} className="absolute inset-0">
              <ImageWithSkeleton
                src="/phone-mockup.jpg"
                alt="MyKisel app interface"
                imgClassName="w-full h-full object-contain object-center"
                style={{ borderRadius: '20px' }}
              />
            </div>
          </div>

        </div>

        <div className="mt-16 pt-6 border-t border-[#1e2a0a] flex items-center justify-between text-white/20 text-xs tracking-widest uppercase">
          <span>UI/UX Portfolio</span>
          <span className="flex items-center gap-2">
            <span className="status-dot text-lime" />
            Available for work
          </span>
        </div>
      </div>
    </section>
  )
}
