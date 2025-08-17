import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the warning limit so extremely large vendor bundles don't spam the console.
    // Keep this reasonably low in general — we split heavy libs instead below.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Manual chunks to separate heavy 3D and postprocessing libraries into their own bundles.
        // This helps browser caching and avoids a single giant vendor chunk.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // three and its examples/transforms
            if (id.includes('three')) return 'vendor-three'
            // react-three packages (fiber, postprocessing, drei, etc.)
            if (id.includes('@react-three')) return 'vendor-react-three'
            // postprocessing library used by @react-three/postprocessing
            if (id.includes('postprocessing')) return 'vendor-postprocessing'
            // fallback vendor chunk
            return 'vendor'
          }
        }
      }
    }
  }
})
