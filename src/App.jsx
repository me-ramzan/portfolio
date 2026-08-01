import CursorTrail from './components/CursorTrail'
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

function App() {
  return (
    <div className="relative min-h-screen bg-[#EDEBE6]">
      <CursorTrail />
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
        <Hero />
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