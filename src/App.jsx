import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { TransitionProvider } from './components/PageTransition.jsx'
import { ToastProvider } from './components/Toast.jsx'
import LogoLoader from './components/LogoLoader.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Ambient from './components/Ambient.jsx'
import Cursor from './components/Cursor.jsx'
import Chatbot from './components/Chatbot.jsx'
import EasterEgg from './components/EasterEgg.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Skills from './pages/Skills.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Contact from './pages/Contact.jsx'
import Lab from './pages/Lab.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function Shell({ ready }) {
  const { pathname } = useLocation()
  return (
    <div className="app" inert={ready ? undefined : ''}>
      <a className="skip" href="#main">پرش به محتوا</a>
      <Navbar />
      <main id="main" key={pathname} className="main page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('is-loading', !ready)
    if (ready) root.classList.add('is-ready')
  }, [ready])

  return (
    <BrowserRouter>
      <ToastProvider>
        <TransitionProvider>
          <ScrollTop />
          <Ambient />
          <Shell ready={ready} />
          <EasterEgg />
          <Cursor />
          {!ready && <LogoLoader onDone={() => setReady(true)} />}
        </TransitionProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
