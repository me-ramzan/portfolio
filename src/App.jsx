import CursorMagnetic from './components/CursorMagnetic'
import Scroll from './components/scroll'
import Navbar from './components/navbar'
import Hero from './components/hero'
import About from './components/about'
import Experience from './components/experience'
import Projects from './components/projects'
import Skills from './components/skills'
import Education from './components/education'
import Contact from './components/contact'
import Footer from './components/footer'
import { useState, useEffect } from 'react'
import Preloader from './components/preloader'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    // Let other components (e.g. the Experience role bar) scroll through Lenis
    window.lenis = lenis

    // Keep GSAP pins/scroll animations in sync with Lenis (removes pin jitter)
    lenis.on('scroll', ScrollTrigger.update)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.lenis === lenis) delete window.lenis
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#EDEBE6]">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <CursorMagnetic />
      <Scroll />
      <div className="h-1 w-full bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      <div className="hidden md:block fixed top-0 right-6 w-px h-full bg-blue-600/70"></div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 40px, rgba(0,0,0,0.4) 40px, rgba(0,0,0,0.4) 42px)",
        }}
      ></div>

      <div className="relative z-10">
        <Navbar />
        <Hero isLoading={isLoading} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default App