import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Approach', href: '#approach' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Education',href: '#education' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef    = useRef(null)
  const mobileRef = useRef(null)
  const { theme, toggle } = useTheme()
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 })
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (menuOpen && mobileRef.current)
      gsap.fromTo(mobileRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
  }, [menuOpen])

  const scrollToSection = (href) => {
    const el = document.querySelector(href)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  const go = (href) => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      scrollToSection(href)
    } else {
      navigate('/')
      setTimeout(() => scrollToSection(href), 400)
    }
  }

  return (
    <nav ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark/95 backdrop-blur-lg border-b border-[#1e2a0a]' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Wordmark */}
          <button onClick={() => window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0 })}
            className="wordmark-box hover:bg-lime/10 transition-colors">
            Tariq Aldinsyah
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => go(l.href)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white font-medium transition-colors tracking-wide">
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop: theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#1e2a0a] text-white/50 hover:text-lime hover:border-lime/40 transition-all"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a href="mailto:aldinsyah1610@gmail.com"
              className="border border-lime/60 text-lime text-sm font-semibold px-5 py-2 rounded-full hover:bg-lime hover:text-dark transition-all duration-200 tracking-wide">
              Let's Talk
            </a>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle}
              className="w-9 h-9 flex items-center justify-center border border-[#1e2a0a] rounded text-white/60 hover:text-lime hover:border-lime/40 transition-colors"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center border border-[#1e2a0a] rounded text-white/60 hover:text-lime hover:border-lime/40 transition-colors">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div ref={mobileRef}
          className="md:hidden bg-dark/98 backdrop-blur-xl border-t border-[#1e2a0a]">
          <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => go(l.href)}
                className="text-left px-4 py-3 text-white/50 hover:text-lime hover:bg-dark-card rounded-lg transition-all text-sm font-medium tracking-wide">
                {l.label}
              </button>
            ))}
            <div className="pt-3 mt-1 border-t border-[#1e2a0a]">
              <a href="mailto:aldinsyah1610@gmail.com"
                className="block text-center border border-lime/60 text-lime text-sm font-semibold px-5 py-3 rounded-full hover:bg-lime hover:text-dark transition-all">
                Let's Talk
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
