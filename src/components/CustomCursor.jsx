import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef   = useRef(null)
  const wrapRef  = useRef(null)
  const ringRef  = useRef(null)
  const labelRef = useRef(null)
  const stateRef = useRef('idle')

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor')

    // Center via xPercent/yPercent, start off-screen
    gsap.set(dotRef.current,  { xPercent: -50, yPercent: -50, x: -300, y: -300 })
    gsap.set(wrapRef.current, { xPercent: -50, yPercent: -50, x: -300, y: -300 })
    // Ring initial state
    gsap.set(ringRef.current, { scale: 0.55, backgroundColor: 'rgba(192,245,61,0)' })
    gsap.set(labelRef.current, { opacity: 0 })

    const applyState = (state) => {
      if (stateRef.current === state) return
      stateRef.current = state

      if (state === 'idle') {
        gsap.to(dotRef.current,   { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' })
        gsap.to(ringRef.current,  { scale: 0.55, backgroundColor: 'rgba(192,245,61,0)', duration: 0.35, ease: 'power3.out' })
        gsap.to(labelRef.current, { opacity: 0, duration: 0.1 })
      } else if (state === 'link') {
        gsap.to(dotRef.current,   { scale: 0, opacity: 0, duration: 0.15 })
        gsap.to(ringRef.current,  { scale: 0.85, backgroundColor: 'rgba(192,245,61,0)', duration: 0.35, ease: 'power3.out' })
        gsap.to(labelRef.current, { opacity: 0, duration: 0.1 })
      } else if (state === 'view') {
        gsap.to(dotRef.current,   { scale: 0, opacity: 0, duration: 0.15 })
        gsap.to(ringRef.current,  { scale: 1, backgroundColor: 'rgba(192,245,61,1)', duration: 0.4, ease: 'power3.out' })
        gsap.to(labelRef.current, { opacity: 1, duration: 0.2, delay: 0.15 })
      }
    }

    const move = (e) => {
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      gsap.to(wrapRef.current, {
        x: e.clientX, y: e.clientY,
        duration: 0.4, ease: 'power2.out', overwrite: 'auto',
      })
    }

    const RING_SCALE = { idle: 0.55, link: 0.85, view: 1 }

    const onDown = () => {
      gsap.to(ringRef.current, { scale: (RING_SCALE[stateRef.current] ?? 0.55) * 0.75, duration: 0.1 })
      if (stateRef.current === 'idle')
        gsap.to(dotRef.current, { scale: 2.2, duration: 0.1 })
    }

    const onUp = () => {
      gsap.to(ringRef.current, { scale: RING_SCALE[stateRef.current] ?? 0.55, duration: 0.4, ease: 'back.out(2)' })
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
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      {/* Small dot — snaps instantly */}
      <div ref={dotRef}
        className="fixed top-0 left-0 z-[1002] pointer-events-none rounded-full"
        style={{ width: 6, height: 6, background: '#C0F53D', willChange: 'transform' }}
      />

      {/* Ring — follows with lag, scales between states */}
      <div ref={wrapRef}
        className="fixed top-0 left-0 z-[1001] pointer-events-none"
        style={{ width: 64, height: 64, willChange: 'transform' }}>

        {/* The actual ring */}
        <div ref={ringRef}
          className="absolute inset-0 rounded-full"
          style={{ border: '1.5px solid #C0F53D', transformOrigin: 'center' }}
        />

        {/* Label — only visible in view state */}
        <div ref={labelRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: 0 }}>
          <span className="font-black uppercase leading-none"
            style={{ fontSize: 8, color: '#070707', letterSpacing: '0.15em' }}>
            VIEW
          </span>
          <span style={{ fontSize: 10, color: '#070707', lineHeight: 1.2 }}>→</span>
        </div>
      </div>
    </>
  )
}
