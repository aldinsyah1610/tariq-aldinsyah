import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (s) => gsap.set(barRef.current, { scaleX: s.progress }),
    })
    return () => st.kill()
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] pointer-events-none"
      style={{ background: 'rgba(192,245,61,0.1)' }}>
      <div ref={barRef} className="h-full bg-lime"
        style={{ transformOrigin: 'left center', transform: 'scaleX(0)' }} />
    </div>
  )
}
