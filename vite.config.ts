import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    // Generate manifest for deployment
    manifest: true
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
})