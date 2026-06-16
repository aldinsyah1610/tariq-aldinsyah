import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'

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
  const navigate  = useNavigate()
  const outerRef  = useRef(null)
  const stickyRef = useRef(null)
  const spokeRefs = useRef([])   // position on ring: updated per frame
  const faceRefs  = useRef([])   // counter-rotation:  updated per frame

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const RADIUS   = isMobile ? 150 : Math.min(window.innerWidth * 0.265, 400)
    const CARD_W   = isMobile ? 92  : 168
    const CARD_H   = isMobile ? 72  : 132

    // Set card dimensions (static — don't go through transform)
    spokeRefs.current.forEach(spoke => {
      if (!spoke) return
      spoke.style.width  = `${CARD_W}px`
      spoke.style.height = `${CARD_H}px`
    })

    // Update all spoke/face transforms for a given orbit angle
    function updateCards(angle) {
      spokeRefs.current.forEach((spoke, i) => {
        const face = faceRefs.current[i]
        if (!spoke || !face) return
        const total = ANGLE_STEP * i + angle
        // Position card on the tilted ring
        spoke.style.transform = `rotateZ(${total}deg) translateY(-${RADIUS}px)`
        // Counter-rotate so card always faces the viewer:
        //   rotateX(TILT_X) × rotateZ(total) × [rotateZ(-total) × rotateX(-TILT_X)] = identity
        face.style.transform  = `rotateZ(${-total}deg) rotateX(${-TILT_X}deg)`
      })
    }

    // Initialise cards at angle=0
    updateCards(0)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (stickyRef.current) stickyRef.current.style.opacity = '1'
      return
    }

    // ScrollTrigger drives the orbit angle via a proxy object
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

    // Fade in on first enter
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

    return () => {
      tl.scrollTrigger?.kill()
      enterST.kill()
    }
  }, [])

  return (
    <section
      ref={outerRef}
      id="works"
      style={{ height: '100vh', position: 'relative', backgroundColor: '#000', overflow: 'hidden' }}
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
                      onClick={() => navigate(`/projects/${p.slug}`)}
                      style={{
                        width: '100%', height: '100%',
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.13)',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.85)',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(192,245,61,0.65)'
                        e.currentTarget.style.boxShadow  = '0 16px 56px rgba(0,0,0,0.9), 0 0 0 1px rgba(192,245,61,0.3)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
                        e.currentTarget.style.boxShadow  = '0 12px 48px rgba(0,0,0,0.85)'
                      }}
                    >
                      <img
                        src={p.src}
                        alt={p.name}
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
          background: 'radial-gradient(ellipse 52% 52% at 50% 50%, rgba(0,0,0,0.75) 0%, transparent 100%)',
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
            color: 'rgba(192,245,61,0.55)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 22,
          }}>
            Selected Works · {N} Projects
          </p>

          <h2 style={{
            fontSize: 'clamp(1.9rem, 4.2vw, 4.8rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '16ch',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Every project is a chance to{' '}
            <em style={{ fontStyle: 'italic', fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 400 }}>solve</em>
            {', '}
            <em style={{ fontStyle: 'italic', fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 400 }}>craft</em>
            {' '}and delight users.
          </h2>
        </div>
      </div>
    </section>
  )
}
