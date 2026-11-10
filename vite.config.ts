import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const publicEnv = loadEnv(mode, process.cwd(), 'REACT_APP_')
  delete publicEnv.REACT_APP_DIGITRANSIT_API_KEY
  delete publicEnv.REACT_APP_DIGITRANSIT_API_URL
  const {
    DIGITRANSIT_API_KEY = '',
    DIGITRANSIT_API_URL = 'https://api.digitransit.fi/geocoding/v1',
  } = loadEnv(mode, process.cwd(), 'DIGITRANSIT_')
  const digitransitUrl = new URL(DIGITRANSIT_API_URL)
  if (digitransitUrl.protocol !== 'https:' || digitransitUrl.username || digitransitUrl.password
    || digitransitUrl.search || digitransitUrl.hash) {
    throw new Error('DIGITRANSIT_API_URL must be an HTTPS base URL without credentials, query parameters, or fragments')
  }
  const proxy = {
    '^/api/digitransit/search(?:\\?|$)': {
      target: digitransitUrl.origin,
      changeOrigin: true,
      rewrite: (path: string) => path.replace('/api/digitransit/search', `${digitransitUrl.pathname.replace(/\/$/, '')}/search`),
      headers: { 'digitransit-subscription-key': DIGITRANSIT_API_KEY },
    },
  }

  return {
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' as const,
      },
    },
  },
  plugins: [
    react(),
    // Only run ESLint in development mode
    ...(mode === 'development' ? [eslint()] : []),
    // Uploads source maps to Sentry; no-op when SENTRY_AUTH_TOKEN is unset (e.g. local dev)
    ...(process.env.SENTRY_AUTH_TOKEN ? [sentryVitePlugin({
      org: 'city-of-helsinki',
      project: process.env.SENTRY_PROJECT ?? 'outdoors-sports-map',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: process.env.REACT_APP_SENTRY_RELEASE },
      sourcemaps: { filesToDeleteAfterUpload: ['./build/**/*.map'] }
    })] : [])
  ],
  server: {
    host: true,
    port: 3000,
    open: true,
    proxy,
    // Required for Sentry browser profiling in dev
    headers: { 'Document-Policy': 'js-profiling' }
  },
  preview: { proxy },
  build: {
    outDir: 'build',
    // Generate manifest for deployment
    manifest: true,
    // Required so Sentry can map errors/profiles back to source
    sourcemap: true
  },
  // Handle absolute imports from src and node_modules
  resolve: {
    alias: {
      '@': '/src',
      '~': '/node_modules'
    }
  },
  envPrefix: [],
  define: Object.fromEntries(
    Object.entries(publicEnv).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])
  )
  }
})