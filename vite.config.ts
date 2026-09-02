import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    // Required for Sentry browser profiling in dev
    headers: { 'Document-Policy': 'js-profiling' }
  },
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
  // Environment variables prefix (keep REACT_APP_ for compatibility)
  envPrefix: 'REACT_APP_'
}))