import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fetchInstagramPosts } from './api/_lib/instagram'

function instagramDevApi(token: string | undefined, userId: string | undefined) {
  return {
    name: 'local-instagram-api',
    configureServer(server: { middlewares: { use: (fn: (req: { url?: string; method?: string }, res: { setHeader: (k: string, v: string) => void; statusCode: number; end: (b?: string) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/api/instagram') {
          next()
          return
        }
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end()
          return
        }
        res.setHeader('Content-Type', 'application/json')
        if (!token) {
          res.statusCode = 503
          res.end(JSON.stringify({ error: 'not_configured', posts: [] }))
          return
        }
        try {
          const posts = await fetchInstagramPosts(token, userId)
          res.statusCode = 200
          res.end(JSON.stringify({ posts }))
        } catch (err) {
          res.statusCode = 502
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : 'instagram_error',
              posts: [],
            }),
          )
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      instagramDevApi(env.INSTAGRAM_ACCESS_TOKEN, env.INSTAGRAM_USER_ID),
    ],
    assetsInclude: ['**/*.glb', '**/*.hdr'],
  }
})
