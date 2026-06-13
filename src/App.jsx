import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import DesignApproach from './components/DesignApproach'
import FeaturedProjects from './components/FeaturedProjects'
import MoreProjects from './components/MoreProjects'
import Skills from './components/Skills'
import Education from './components/Education'
import BeyondDesign from './components/BeyondDesign'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import CursorGlow from './components/CursorGlow'
import CustomCursor from './components/CustomCursor'
import BackgroundFX from './components/BackgroundFX'

function App() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <CursorGlow />
      <CustomCursor />
      <BackgroundFX />
      {/* All main content sits above background decorations */}
      <div className="relative z-[10]">
        <Navbar />
        <Hero />
        <About />
        <FeaturedProjects />
        <DesignApproach />
        <MoreProjects />
        <Skills />
        <Education />
        <BeyondDesign />
        <Contact />
      </div>
    </div>
  )
}

export default App
