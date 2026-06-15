import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// SVG geometry
const SIZE   = 64
const CX     = 32
const CY     = 32
const R      = 28
const CIRCUM = 2 * Math.PI * R  // ≈ 175.9

export default function CustomCursor() {
  const dotRef    = useRef(null)
  const wrapRef   = useRef(null)
  const svgRef    = useRef(null)
  const arcRef    = useRef(null)
  const stateRef  = useRef('idle')
  const spinRef   = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor')

    gsap.set(dotRef.current,  { xPercent: -50, yPercent: -50, x: -200, y: -200 })
    gsap.set(wrapRef.current, { xPercent: -50, yPercent: -50, x: -200, y: -200 })
    gsap.set(wrapRef.current, { scale: 0.52 })

    // Arc is 75% of circle in idle → spins slowly
    arcRef.current?.setAttribute('stroke-dasharray', `${CIRCUM * 0.75} ${CIRCUM * 0.25}`)

    const spin = (duration) => {
      if (spinRef.current) spinRef.current.kill()
      spinRef.current = gsap.to(svgRef.current, {
        rotation: 360,
        duration,
        ease: 'none',
        repeat: -1,
        overwrite: true,
      })
    }

    const applyState = (state) => {
      if (stateRef.current === state) return
      stateRef.current = state

      if (state === 'idle') {
        gsap.to(dotRef.current,  { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(wrapRef.current, { scale: 0.52, duration: 0.45, ease: 'power3.out' })
        arcRef.current?.setAttribute('stroke-dasharray', `${CIRCUM * 0.75} ${CIRCUM * 0.25}`)
        gsap.to(arcRef.current, { attr: { 'stroke-width': 1 }, duration: 0.3 })
        spin(12)   // slow idle spin
      }

      if (state === 'link') {
        gsap.to(dotRef.current,  { scale: 0, opacity: 0, duration: 0.15 })
        gsap.to(wrapRef.current, { scale: 0.82, duration: 0.4, ease: 'power3.out' })
        arcRef.current?.setAttribute('stroke-dasharray', `${CIRCUM * 0.88} ${CIRCUM * 0.12}`)
        gsap.to(arcRef.current, { attr: { 'stroke-width': 1.5 }, duration: 0.3 })
        spin(5)    // medium spin on links
      }

      if (state === 'view') {
        gsap.to(dotRef.current,  { scale: 0, opacity: 0, duration: 0.15 })
        gsap.to(wrapRef.current, { scale: 1, duration: 0.45, ease: 'power3.out' })
        arcRef.current?.setAttribute('stroke-dasharray', `${CIRCUM * 0.96} ${CIRCUM * 0.04}`)
        gsap.to(arcRef.current, { attr: { 'stroke-width': 1.5 }, duration: 0.3 })
        spin(2.2)  // fast spin on project cards
      }
    }

    // Begin idle spin immediately
    spin(12)

    const move = (e) => {
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      gsap.to(wrapRef.current, {
        x: e.clientX, y: e.clientY,
        duration: 0.42, ease: 'power2.out', overwrite: 'auto',
      })
    }

    const RING_SCALE = { idle: 0.52, link: 0.82, view: 1 }

    const onDown = () => {
      gsap.to(wrapRef.current, { scale: (RING_SCALE[stateRef.current] ?? 0.52) * 0.75, duration: 0.1 })
      if (stateRef.current === 'idle')
        gsap.to(dotRef.current, { scale: 2.5, duration: 0.1 })
    }

    const onUp = () => {
      gsap.to(wrapRef.current, { scale: RING_SCALE[stateRef.current] ?? 0.52, duration: 0.45, ease: 'back.out(2)' })
      if (stateRef.current === 'idle')
        gsap.to(dotRef.current, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
    }

    const onOver = (e) => {
      if (e.target.closest('[data-cursor="view"]')) {
        applyState('view')
      } else if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        applyState('link')
      } else {
        applyState('idle')
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseover', onOver)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      if (spinRef.current) spinRef.current.kill()
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to exact cursor */}
      <div ref={dotRef}
        className="fixed top-0 left-0 z-[1002] pointer-events-none rounded-full"
        style={{ width: 6, height: 6, background: '#C0F53D', willChange: 'transform' }}
      />

      {/* Ring wrapper — follows with lag */}
      <div ref={wrapRef}
        className="fixed top-0 left-0 z-[1001] pointer-events-none"
        style={{ width: SIZE, height: SIZE, willChange: 'transform' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}>
          <circle
            ref={arcRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#C0F53D"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  )
}
