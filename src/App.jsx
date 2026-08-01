import CursorTrail from './components/CursorTrail'
import Scroll from './components/Scroll'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

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