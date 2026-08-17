import { useEffect, useState } from 'react'
import { SITE } from '../../config/site'
import type { InstagramPost } from '../../types/instagram'

type FeedState =
  | { status: 'loading' }
  | { status: 'ready'; posts: InstagramPost[] }
  | { status: 'empty'; reason: 'not_configured' | 'error' }

export function InstagramGrid() {
  const { handle, url } = SITE.instagram
  const [state, setState] = useState<FeedState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/instagram')
        const json = (await res.json()) as {
          posts?: InstagramPost[]
          error?: string
        }
        if (cancelled) return
        const posts = json.posts ?? []
        if (posts.length === 0) {
          setState({
            status: 'empty',
            reason: json.error === 'not_configured' ? 'not_configured' : 'error',
          })
          return
        }
        setState({ status: 'ready', posts })
      } catch {
        if (!cancelled) setState({ status: 'empty', reason: 'error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      className="mt-20 border-t border-[var(--line)] pt-16 md:mt-28 md:pt-20"
      aria-labelledby="instagram-heading"
    >
      <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[10px] tracking-[0.4em] uppercase text-[var(--muted)]">
            Street
          </p>
          <h2 id="instagram-heading" className="font-brand text-4xl leading-none md:text-5xl">
            Instagram
          </h2>
          <p className="mt-4 max-w-sm text-sm font-light tracking-[0.06em] text-[var(--ink-soft)]">
            Live pieces from @{handle} — house of madness in motion.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex w-fit border-b border-[var(--ink)] pb-1 text-[10px] tracking-[0.35em] uppercase text-[var(--ink)] transition-opacity hover:opacity-60"
        >
          @{handle}
        </a>
      </div>

      {state.status === 'loading' && (
        <div className="grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-3" aria-busy="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[var(--bg-deep)]" />
          ))}
        </div>
      )}

      {state.status === 'ready' && (
        <ul className="grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-3">
          {state.posts.map((post) => (
            <li key={post.id}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative block aspect-square overflow-hidden bg-[var(--bg-deep)]"
              >
                <img
                  src={post.image}
                  alt={post.caption ? post.caption.slice(0, 120) : `Instagram post by @${handle}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      {state.status === 'empty' && (
        <p className="text-sm font-light tracking-[0.05em] text-[var(--muted)]">
          {state.reason === 'not_configured' ? (
            <>
              Instagram API is not connected yet.{' '}
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4"
              >
                View @{handle}
              </a>
            </>
          ) : (
            <>
              Feed failed to load.{' '}
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4"
              >
                Open Instagram
              </a>
            </>
          )}
        </p>
      )}
    </section>
  )
}
