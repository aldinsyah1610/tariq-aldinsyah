import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const SIZE = 500
    const onMove = (e) => gsap.to(ref.current, {
      x: e.clientX - SIZE / 2,
      y: e.clientY - SIZE / 2,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[1] rounded-full"
      style={{
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(192,245,61,0.055) 0%, transparent 65%)',
      }} />
  )
}
