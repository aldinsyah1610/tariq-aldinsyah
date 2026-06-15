import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Preloader({ onComplete }) {
  const wrapRef    = useRef(null)
  const counterRef = useRef(null)
  const lineRef    = useRef(null)
  const nameRef    = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (window.__lenis) window.__lenis.stop()

    const ctx = gsap.context(() => {
      const obj = { val: 0 }

      const tl = gsap.timeline({
        onComplete() {
          document.body.style.overflow = ''
          if (window.__lenis) window.__lenis.start()
          window.__preloaderDone = true
          ScrollTrigger.refresh()
          window.dispatchEvent(new CustomEvent('preloader-done'))
          onComplete?.()
        },
      })

      tl.to(obj, {
          val: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate() {
            const v = Math.round(obj.val)
            if (counterRef.current)
              counterRef.current.textContent = String(v).padStart(3, '0')
            if (lineRef.current)
              lineRef.current.style.transform = `scaleX(${v / 100})`
          },
        })
        .fromTo(nameRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '<0.8')
        .to(wrapRef.current,
          { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.15 })
    })

    return () => {
      document.body.style.overflow = ''
      ctx.revert()
    }
  }, [])

  return (
    <div ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
      style={{ background: '#070707' }}>

      <div ref={counterRef}
        className="text-white font-black tabular-nums"
        style={{
          fontSize: 'clamp(5rem, 17vw, 15rem)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
        000
      </div>

      <p ref={nameRef}
        className="text-white/25 text-[10px] uppercase tracking-[0.38em] mt-6"
        style={{ opacity: 0 }}>
        Tariq Aldinsyah · Portfolio 2026
      </p>

      <div className="absolute bottom-10 left-10 right-10">
        <div className="flex items-center justify-between text-white/20 text-[10px] uppercase tracking-widest mb-3">
          <span>Loading</span>
          <span>UI/UX Portfolio</span>
        </div>
        <div className="h-px bg-white/10">
          <div ref={lineRef}
            className="h-full"
            style={{ background: '#C0F53D', transformOrigin: 'left center', transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  )
}
