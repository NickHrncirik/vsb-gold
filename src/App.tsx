import { useCallback, useState } from 'react'
import { Hero } from './components/Hero'
import { Loading } from './components/Loading'
import { useDeviceProfile } from './hooks/useDeviceProfile'

export default function App() {
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

  return (
    <main className="relative min-h-screen bg-[var(--bg)]">
      <Loading progress={progress} visible={loadingVisible} />
      <Hero
        profile={profile}
        onSceneReady={onSceneReady}
        onLoadProgress={onLoadProgress}
      />
    </main>
  )
}
