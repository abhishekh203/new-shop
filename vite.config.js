import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for better debugging
    sourcemap: false,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material', 'antd'],
          motion: ['framer-motion'],
          icons: ['react-icons'],
        }
      }
    },
    // Optimize assets
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-icons',
      '@mui/material',
      '@mui/icons-material'
    ]
  },
  // Server configuration for development
  server: {
    // Enable compression
    compress: true,
    // Open browser automatically
    open: false,
  },
  // Preview configuration for production preview
  preview: {
    port: 3000,
    open: false,
  }
})