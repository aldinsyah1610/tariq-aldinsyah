import { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ScrollToTop from './components/ScrollToTop'

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import ProcessBreakdown from './components/ProcessBreakdown'
import DesignApproach from './components/DesignApproach'
import FeaturedProjects from './components/FeaturedProjects'
import MoreProjects from './components/MoreProjects'
import WorksReel from './components/WorksReel'
import Skills from './components/Skills'
import SkillRadar from './components/SkillRadar'
import Education from './components/Education'
import WorkExperience from './components/WorkExperience'
import BeyondDesign from './components/BeyondDesign'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import CursorGlow from './components/CursorGlow'
import CustomCursor from './components/CustomCursor'
import BackgroundFX from './components/BackgroundFX'
import Marquee from './components/Marquee'
import Testimonials from './components/Testimonials'
import Breather from './components/Breather'

function Home() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <CursorGlow />
      <CustomCursor />
      <BackgroundFX />
      <div className="relative z-[10]">
        <Navbar />
        <Hero />
        <WorksReel />
        <About />
        <ProcessBreakdown />
        <FeaturedProjects />
        <Testimonials />
        <Breather />
        <Marquee />
        <DesignApproach />
        <MoreProjects />
        <Skills />
        <SkillRadar />
        <Education />
        <WorkExperience />
        <BeyondDesign />
        <Contact />
      </div>
    </div>
  )
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={
          <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg)' }} />}>
            <ProjectDetail />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
