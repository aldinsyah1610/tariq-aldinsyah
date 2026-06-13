import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef     = useRef(null)
  const reticleRef = useRef(null)
  const isHover    = useRef(false)

  useEffect(() => {
    // Only on true pointer devices (not touch)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor')

    const move = (e) => {
      // Dot: instant
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      // Reticle: slight lag
      gsap.to(reticleRef.current, {
        x: e.clientX, y: e.clientY,
        duration: 0.18, ease: 'power2.out', overwrite: true,
      })
    }

    const down = () => {
      gsap.to(reticleRef.current, { scale: 0.7, duration: 0.1 })
      gsap.to(dotRef.current,     { scale: 1.8, duration: 0.1 })
    }
    const up = () => {
      gsap.to(reticleRef.current, { scale: isHover.current ? 1.6 : 1, duration: 0.3, ease: 'back.out(2)' })
      gsap.to(dotRef.current,     { scale: 1, duration: 0.2 })
    }

    // Event delegation for hover on interactive elements
    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, [tabindex]')) {
        isHover.current = true
        gsap.to(reticleRef.current, { scale: 1.6, opacity: 0.85, duration: 0.25, ease: 'power2.out' })
        gsap.to(dotRef.current,     { scale: 0, duration: 0.2 })
      }
    }
    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, [tabindex]')) {
        isHover.current = false
        gsap.to(reticleRef.current, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' })
        gsap.to(dotRef.current,     { scale: 1, duration: 0.2 })
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup',   up)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup',   up)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
    }
  }, [])

  return (
    <>
      {/* Centre dot — snaps to cursor */}
      <div ref={dotRef}
        className="fixed top-0 left-0 z-[1001] pointer-events-none rounded-full bg-lime"
        style={{ width: 5, height: 5, marginLeft: -2.5, marginTop: -2.5, willChange: 'transform' }} />

      {/* Targeting reticle — follows with lag */}
      <div ref={reticleRef}
        className="fixed top-0 left-0 z-[1000] pointer-events-none"
        style={{ marginLeft: -20, marginTop: -20, willChange: 'transform' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top-left corner */}
          <line x1="2"  y1="11" x2="2"  y2="2"  stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2"  y1="2"  x2="11" y2="2"  stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          {/* Top-right corner */}
          <line x1="29" y1="2"  x2="38" y2="2"  stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="2"  x2="38" y2="11" stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bottom-left corner */}
          <line x1="2"  y1="29" x2="2"  y2="38" stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2"  y1="38" x2="11" y2="38" stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bottom-right corner */}
          <line x1="29" y1="38" x2="38" y2="38" stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="29" x2="38" y2="38" stroke="#C0F53D" strokeWidth="1.5" strokeLinecap="round" />
          {/* Tiny centre crosshair */}
          <line x1="17" y1="20" x2="23" y2="20" stroke="#C0F53D" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="20" y1="17" x2="20" y2="23" stroke="#C0F53D" strokeWidth="0.8" strokeOpacity="0.5" />
        </svg>
      </div>
    </>
  )
}
