import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PageShell } from './components/layout/PageShell'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { AtelierPage } from './pages/AtelierPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPage } from './pages/PrivacyPage'

gsap.registerPlugin(ScrollTrigger)

function clearScrollPins() {
  ScrollTrigger.getAll().forEach((t) => t.kill())
  document.querySelectorAll('.pin-spacer').forEach((spacer) => {
    const parent = spacer.parentElement
    if (!parent) {
      spacer.remove()
      return
    }
    while (spacer.firstChild) {
      parent.insertBefore(spacer.firstChild, spacer)
    }
    spacer.remove()
  })
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  ScrollTrigger.refresh()
}

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname === '/') return

    clearScrollPins()

    if (hash) {
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PageShell />}>
          <Route path="collection" element={<CollectionPage />} />
          <Route path="atelier" element={<AtelierPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
