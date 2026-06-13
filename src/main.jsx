import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize theme before first render to avoid flash
const savedTheme = localStorage.getItem('theme') || 'dark'
document.documentElement.setAttribute('data-theme', savedTheme)
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
})

window.__lenis = lenis

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add(time => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
