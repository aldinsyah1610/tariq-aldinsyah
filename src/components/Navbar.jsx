import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useScramble } from '../hooks/useScramble'
import { useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About',    href: '#about',          num: '01' },
  { label: 'Projects', href: '#projects',        num: '02' },
  { label: 'Process',  href: '#approach',        num: '03' },
  { label: 'Skills',   href: '#skills',          num: '04' },
  { label: 'Work',     href: '#more-projects',   num: '05' },
  { label: 'Contact',  href: '#contact',         num: '06' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef       = useRef(null)
  const overlayRef   = useRef(null)
  const linksRef     = useRef([])
  const sideRef      = useRef(null)
  const themeIconRef = useRef(null)
  const menuIconRef  = useRef(null)
  const { theme, toggle } = useTheme()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Scroll detect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Theme icon swap animation
  useEffect(() => {
    const el = themeIconRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(el,
      { opacity: 0, scale: 0.82, filter: 'blur(3px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out', clearProps: 'filter' }
    )
  }, [theme])

  // Menu / close icon swap animation
  useEffect(() => {
    const el = menuIconRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(el,
      { opacity: 0, scale: 0.82, filter: 'blur(3px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out', clearProps: 'filter' }
    )
  }, [open])

  // Nav drop-in — wait for preloader
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 2.75 }
    )
  }, [])

  // Body scroll lock when overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      if (window.__lenis) window.__lenis.stop()
    } else {
      document.body.style.overflow = ''
      if (window.__lenis) window.__lenis.start()
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Open animation — useLayoutEffect so GSAP sets initial states BEFORE browser paint.
  // This prevents the overlay from flashing on-screen or links staying invisible if
  // useEffect fired too late on slower mobile devices.
  useLayoutEffect(() => {
    if (!open || !overlayRef.current) return
    const links   = linksRef.current.filter(Boolean)
    const side    = sideRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.killTweensOf([overlayRef.current, ...links, side].filter(Boolean))

    if (reduced) {
      gsap.set(overlayRef.current, { yPercent: 0 })
      gsap.set(links, { opacity: 1, y: 0 })
      if (side) gsap.set(side, { opacity: 1, x: 0 })
      return
    }

    // Set hidden state synchronously — before first paint — so nothing flashes
    gsap.set(overlayRef.current, { yPercent: -100 })
    gsap.set(links, { opacity: 0, y: 50 })
    if (side) gsap.set(side, { opacity: 0, x: 20 })

    const tl = gsap.timeline()
    tl.to(overlayRef.current, { yPercent: 0, duration: 0.75, ease: 'power4.inOut' })
      .to(links, { opacity: 1, y: 0, stagger: 0.065, duration: 0.55, ease: 'power3.out' }, '-=0.35')

    if (side) {
      tl.to(side, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, '-=0.35')
    }

    return () => tl.kill()
  }, [open])

  const closeMenu = () => {
    // Restore scroll immediately — don't wait for onComplete.
    document.body.style.overflow = ''
    if (window.__lenis) window.__lenis.start()

    const links = linksRef.current.filter(Boolean)
    const side  = sideRef.current
    const tl = gsap.timeline({ onComplete: () => setOpen(false) })
    tl.to([...links].reverse(), { y: -20, opacity: 0, stagger: 0.04, duration: 0.3, ease: 'power2.in' })
    if (side) tl.to(side, { opacity: 0, duration: 0.2 }, '<')
    tl.to(overlayRef.current, { yPercent: -100, duration: 0.65, ease: 'power4.inOut' }, '-=0.1')
  }

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (!el) return
    if (window.__lenis) { window.__lenis.start(); window.__lenis.scrollTo(el) }
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  const go = (href) => {
    closeMenu()
    setTimeout(() => {
      if (location.pathname !== '/') { navigate('/'); setTimeout(() => scrollTo(href), 400) }
      else scrollTo(href)
    }, 780)
  }

  return (
    <>
      <nav ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled && !open ? 'bg-dark/95 backdrop-blur-lg border-b border-[#1e2a0a]' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button onClick={() => window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0 })}
              style={{ position: 'relative', zIndex: 102 }}
              className="wordmark-box hover:bg-lime/10 transition-colors">
              Tariq Aldinsyah
            </button>

            {/* Desktop shortcut links */}
            <nav className="hidden lg:flex items-center gap-1" style={{ position: 'relative', zIndex: 102 }}>
              {navLinks.map((l) => (
                <button key={l.href}
                  onClick={() => {
                    const el = document.querySelector(l.href)
                    if (!el) return
                    if (window.__lenis) window.__lenis.scrollTo(el)
                    else el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-white/40 hover:text-lime transition-colors rounded-md hover:bg-lime/5">
                  {l.label}
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 102 }}>
              <button onClick={toggle} aria-label="Toggle theme"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#1e2a0a] text-white/50 hover:text-lime hover:border-lime/40 transition-all">
                <span ref={themeIconRef} style={{ display: 'inline-flex' }}>
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </span>
              </button>
              <a href="mailto:aldinsyah1610@gmail.com"
                className="hidden md:inline-flex border border-lime/60 text-lime text-sm font-semibold px-5 py-2 rounded-full hover:bg-lime hover:text-dark transition-all duration-200 tracking-wide">
                Let's Talk
              </a>
              <button
                onClick={open ? closeMenu : () => setOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg text-white/70 hover:text-lime transition-colors text-[11px] font-bold tracking-[0.15em] uppercase border border-white/15 hover:border-lime/40">
                <span ref={menuIconRef} style={{ display: 'inline-flex' }}>
                  {open ? <X size={13} /> : <Menu size={13} />}
                </span>
                <span>{open ? 'Close' : 'Menu'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen overlay — no inline transform/opacity; GSAP handles all initial states
          via useLayoutEffect so nothing flashes before animation starts */}
      {open && (
        <div ref={overlayRef}
          className="fixed inset-0 z-[99] flex"
          style={{ background: '#070707' }}>

          {/* Left — large nav links */}
          <div className="flex-1 flex flex-col justify-center px-10 lg:px-20 overflow-y-auto">
            {navLinks.map((l, i) => (
              <NavOverlayLink
                key={l.href}
                link={l}
                innerRef={el => { linksRef.current[i] = el }}
                onClick={() => go(l.href)}
              />
            ))}
          </div>

          {/* Right — contact + social (desktop only) */}
          <div ref={sideRef}
            className="hidden lg:flex flex-col justify-between w-72 px-10 py-16 border-l border-white/[0.07]">
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-6">Contact</p>
              <a href="mailto:aldinsyah1610@gmail.com"
                className="block text-white/60 text-sm hover:text-lime transition-colors mb-3">
                aldinsyah1610@gmail.com
              </a>
              <a href="tel:+62811922857"
                className="block text-white/35 text-sm hover:text-lime transition-colors">
                +62 811 922 857
              </a>
            </div>
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-5">Follow</p>
              {[
                ['LinkedIn', 'https://linkedin.com/in/tariqaldinsyah'],
                ['Behance',  'https://behance.net/tariqaldinsyah'],
              ].map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between text-white/35 text-sm hover:text-lime transition-colors mb-3 group">
                  {label}
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
              <div className="mt-8 pt-8 border-t border-white/[0.07]">
                <p className="text-white/15 text-xs">© 2026 Tariq Aldinsyah</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NavOverlayLink({ link, innerRef, onClick }) {
  const { ref, scramble, reset } = useScramble(link.label.toUpperCase())

  return (
    <div
      ref={innerRef}
      onClick={onClick}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className="group flex items-baseline gap-5 py-4 lg:py-5 cursor-pointer border-b border-white/[0.06] hover:border-lime/20 transition-colors">
      <span className="text-lime/35 text-xs font-bold tabular-nums w-7 shrink-0">{link.num}</span>
      <span ref={ref}
        className="font-black text-white/75 group-hover:text-white transition-colors"
        style={{
          fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
        {link.label.toUpperCase()}
      </span>
    </div>
  )
}
