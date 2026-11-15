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
import { useIsTouch } from './lib/ui'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const isTouch = useIsTouch()

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

    // Phones/tablets: when the address bar shows/hides, the height changes a little.
    // Don't recalculate every locked section for that (it causes jumps); only on real resizes.
    ScrollTrigger.config({ ignoreMobileResize: true })

    // Re-measure locked sections after rotating a phone or tablet
    const onRotate = () => setTimeout(() => ScrollTrigger.refresh(), 350)
    window.addEventListener('orientationchange', onRotate)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.removeEventListener('orientationchange', onRotate)
      if (window.lenis === lenis) delete window.lenis
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#EDEBE6]" style={{ overflowX: 'clip' }}>
      {/* Site-wide side margin:
          6% of the width normally, but on very wide screens the content stops
          growing at ~1680px and the extra space becomes margin. */}
      <style>{`
        :root { --gutter: max(6vw, calc((100vw - 1680px) / 2)); }
        html, body { overflow-x: clip; }
        img, video { max-width: 100%; }
      `}</style>

      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {/* Custom cursor only for mouse/trackpad users */}
      {!isTouch && <CursorMagnetic />}
      <Scroll />
      <div className="h-1 w-full bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      {!isTouch && <div className="hidden md:block fixed top-0 right-6 w-px h-full bg-blue-600/70"></div>}

      <div className="relative z-10" data-morph-root>
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