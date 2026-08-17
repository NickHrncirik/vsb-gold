import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from './components/Hero'
import { Loading } from './components/Loading'
import { PageShell } from './components/layout/PageShell'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { Seo } from './components/seo/Seo'
import { useDeviceProfile } from './hooks/useDeviceProfile'
import { SITE } from './config/site'
import { CollectionPage } from './pages/CollectionPage'
import { AtelierPage } from './pages/AtelierPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPage } from './pages/PrivacyPage'

gsap.registerPlugin(ScrollTrigger)

/** Kill leftover pin spacers from the home ScrollTrigger when leaving `/`. */
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

/** Home stays identical to the working GitHub version — only SEO + header overlay added. */
function HomePage() {
  const profile = useDeviceProfile()
  const [progress, setProgress] = useState(0)
  const [loadingVisible, setLoadingVisible] = useState(true)

  const onLoadProgress = useCallback((n: number) => {
    setProgress((p) => Math.max(p, n))
  }, [])

  const onSceneReady = useCallback(() => {
    setProgress(100)
    window.setTimeout(() => setLoadingVisible(false), 420)
  }, [])

  useEffect(() => {
    return () => {
      clearScrollPins()
    }
  }, [])

  return (
    <>
      <Seo
        path="/"
        description={SITE.description}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          email: SITE.email,
          logo: `${SITE.url}/brand/logo.png`,
        }}
      />
      <SiteHeader transparent />
      <main className="relative bg-[var(--bg)]">
        <Loading progress={progress} visible={loadingVisible} />
        <Hero
          profile={profile}
          onSceneReady={onSceneReady}
          onLoadProgress={onLoadProgress}
        />
        <SiteFooter />
      </main>
    </>
  )
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
