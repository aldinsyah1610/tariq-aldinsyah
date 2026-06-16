import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

gsap.registerPlugin(ScrollTrigger)

// Gallery images — exactly the 12 mockups provided (work-1.jpg … work-12.jpg in public/)
const PROJECTS = [
  { src: '/work-1.jpg',  name: 'Coopin',             type: 'Fintech Mobile App',    slug: 'coopin-ecosystem'   },
  { src: '/work-2.jpg',  name: 'Piranti HRIS',       type: 'HR Mobile App',         slug: 'ifmc'               },
  { src: '/work-3.jpg',  name: 'Field Absensi',      type: 'Attendance Mobile App', slug: 'marissa-hris'       },
  { src: '/work-4.jpg',  name: 'MyKisel',            type: 'App Redesign',          slug: 'mykisel-redesign'   },
  { src: '/work-5.jpg',  name: 'Coopin Web',         type: 'Fintech Web Platform',  slug: 'coopin-ecosystem'   },
  { src: '/work-6.jpg',  name: 'IT Monitoring',      type: 'Web Dashboard',         slug: 'ifmc'               },
  { src: '/work-7.jpg',  name: 'Dira Helpdesk',      type: 'Helpdesk Dashboard',    slug: 'dira-helpdesk'      },
  { src: '/work-8.jpg',  name: 'Nexus Care',         type: 'Healthcare Dashboard',  slug: 'nexus-care'         },
  { src: '/work-9.jpg',  name: 'BayarAja Canvasser', type: 'B2B Mobile App',        slug: 'bayaraja-canvasser' },
  { src: '/work-10.jpg', name: 'BayarAja',           type: 'Payment App',           slug: 'bayaraja'           },
  { src: '/work-11.jpg', name: 'Marissa HRIS',       type: 'HR Mobile App',         slug: 'marissa-hris'       },
  { src: '/work-12.jpg', name: 'BayarAja POS',       type: 'Tablet POS App',        slug: 'bayaraja-pos'       },
]

const N       = PROJECTS.length
const TILT_X  = 72  // deg — tilts orbit ring nearly flat; makes back cards high/small, front low/large
const ANGLE_STEP = 360 / N

export default function WorksWheel() {
  const { theme } = useTheme()
  const navigate  = useNavigate()
  const outerRef  = useRef(null)
  const stickyRef = useRef(null)
  const spokeRefs = useRef([])   // position on ring: updated per frame
  const faceRefs  = useRef([])   // counter-rotation:  updated per frame

  useEffect(() => {
    let RADIUS = 0, CARD_W = 0, CARD_H = 0

    function applyLayout() {
      const isMobile = (outerRef.current?.offsetWidth ?? window.innerWidth) < 768
      RADIUS = isMobile ? 150 : Math.min(window.innerWidth * 0.265, 400)
      CARD_W = isMobile ? 92  : 168
      CARD_H = isMobile ? 72  : 132
      spokeRefs.current.forEach(spoke => {
        if (!spoke) return
        spoke.style.width  = `${CARD_W}px`
        spoke.style.height = `${CARD_H}px`
      })
    }

    function updateCards(angle) {
      spokeRefs.current.forEach((spoke, i) => {
        const face = faceRefs.current[i]
        if (!spoke || !face) return
        const total = ANGLE_STEP * i + angle
        spoke.style.transform = `rotateZ(${total}deg) translateY(-${RADIUS}px)`
        face.style.transform  = `rotateZ(${-total}deg) rotateX(${-TILT_X}deg)`
      })
    }

    applyLayout()
    updateCards(0)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (stickyRef.current) stickyRef.current.style.opacity = '1'
      const ro = new ResizeObserver(() => { applyLayout(); updateCards(0) })
      ro.observe(outerRef.current)
      return () => ro.disconnect()
    }

    const proxy = { angle: 0 }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.8,
      },
    })
    tl.to(proxy, {
      angle: 180,
      ease: 'none',
      onUpdate() { updateCards(proxy.angle) },
    })

    const enterST = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.fromTo(stickyRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.3, ease: 'power2.out' })
      },
    })

    const ro = new ResizeObserver(() => { applyLayout(); updateCards(proxy.angle) })
    ro.observe(outerRef.current)

    return () => {
      tl.scrollTrigger?.kill()
      enterST.kill()
      ro.disconnect()
    }
  }, [])

  return (
    <section
      ref={outerRef}
      id="works"
      aria-label="Selected Works"
      style={{ height: '100vh', position: 'relative', backgroundColor: 'var(--bg)', overflow: 'hidden' }}
    >
      <div
        ref={stickyRef}
        style={{ position: 'absolute', inset: 0, opacity: 0 }}
      >

        {/* ── 3-D perspective stage ── */}
        <div style={{
          position: 'absolute', inset: 0,
          perspective: '900px',
          perspectiveOrigin: '50% 50%',
        }}>
          {/*
            Orbit ring — tilted by rotateX(TILT_X) so the ring looks like
            a disc viewed at an angle: bottom cards are close (large), top cards far (small).
            Spokes are positioned around the ring via JS (rotateZ + translateY).
          */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: 0, height: 0,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${TILT_X}deg)`,
          }}>
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                ref={el => spokeRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  transformStyle: 'preserve-3d',
                  // No backfaceVisibility:hidden — back cards are visible (just smaller)
                }}
              >
                {/* Counter-rotation: makes every card face the viewer */}
                <div
                  ref={el => faceRefs.current[i] = el}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Centre card on its anchor point */}
                  <div style={{
                    width: '100%', height: '100%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${p.name} — ${p.type}`}
                      onClick={() => navigate(`/projects/${p.slug}`)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/projects/${p.slug}`)
                        }
                      }}
                      style={{
                        width: '100%', height: '100%',
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: `1px solid ${theme === 'light' ? 'rgba(30,26,9,0.12)' : 'rgba(255,255,255,0.13)'}`,
                        boxShadow: '0 12px 48px rgba(0,0,0,0.85)',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                      onMouseEnter={e => {
                        const lt = document.documentElement.dataset.theme === 'light'
                        e.currentTarget.style.borderColor = lt ? 'rgba(92,138,0,0.65)' : 'rgba(192,245,61,0.65)'
                        e.currentTarget.style.boxShadow  = lt
                          ? '0 16px 56px rgba(0,0,0,0.18), 0 0 0 1px rgba(92,138,0,0.3)'
                          : '0 16px 56px rgba(0,0,0,0.9), 0 0 0 1px rgba(192,245,61,0.3)'
                      }}
                      onMouseLeave={e => {
                        const lt = document.documentElement.dataset.theme === 'light'
                        e.currentTarget.style.borderColor = lt ? 'rgba(30,26,9,0.12)' : 'rgba(255,255,255,0.13)'
                        e.currentTarget.style.boxShadow  = '0 12px 48px rgba(0,0,0,0.85)'
                      }}
                    >
                      <img
                        src={p.src}
                        alt=""
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Radial vignette — keeps centre text readable ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none',
          background: theme === 'light'
            ? 'radial-gradient(ellipse 52% 52% at 50% 50%, rgba(245,245,238,0.90) 0%, transparent 100%)'
            : 'radial-gradient(ellipse 52% 52% at 50% 50%, rgba(8,12,2,0.82) 0%, transparent 100%)',
        }} />

        {/* ── Centre editorial text ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 clamp(24px,6vw,80px)',
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <p style={{
            color: theme === 'light' ? 'rgba(92,138,0,0.75)' : 'rgba(192,245,61,0.55)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 22,
          }}>
            Selected Works · {N} Projects
          </p>

          <h2 style={{
            fontSize: 'clamp(1.9rem, 4.2vw, 4.8rem)',
            fontWeight: 900,
            color: 'var(--text)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '16ch',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Every project is a chance to{' '}
            <em style={{ fontStyle: 'italic', fontFamily: "'Bodoni Moda', Georgia, serif", fontWeight: 400 }}>solve</em>
            {', '}
            <em style={{ fontStyle: 'italic', fontFamily: "'Bodoni Moda', Georgia, serif", fontWeight: 400 }}>craft</em>
            {' '}and delight users.
          </h2>
        </div>
      </div>
    </section>
  )
}
