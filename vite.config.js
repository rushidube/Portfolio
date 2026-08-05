import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /*
         * Split the framework and the animation runtime into their own chunks.
         * They change only when a dependency is upgraded, so editing content or
         * tweaking a variant no longer invalidates ~100kB of cached vendor code
         * for returning visitors.
         */
        manualChunks: {
          // `react-dom/client` and `react/jsx-runtime` are distinct module ids
          // from their package roots; without them the bulk of React lands back
          // in the app chunk.
          react: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
          motion: ['motion'],
        },
      },
    },
  },
})
