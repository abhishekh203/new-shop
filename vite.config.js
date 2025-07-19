import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for better debugging in production
    sourcemap: false,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          animations: ['framer-motion'],
          icons: ['react-icons'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          utils: ['react-hot-toast', 'react-redux', '@reduxjs/toolkit']
        }
      }
    },
    // Optimize assets
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Ensure .htaccess is copied to dist folder
    copyPublicDir: true,
    // Set chunk size warning limit higher
    chunkSizeWarningLimit: 1000,
    // Minify with better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Configure public directory
  publicDir: 'public',
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-icons',
      '@mui/material',
      '@mui/icons-material',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ]
  },
  // Server configuration for development
  server: {
    // Enable compression
    compress: true,
    // Open browser automatically
    open: false,
    // Handle client-side routing in development
    historyApiFallback: true,
    // Enable hot module replacement
    hmr: {
      overlay: true
    }
  },
  // Preview configuration for production preview
  preview: {
    port: 3000,
    open: false,
  },
  // Define aliases for better imports
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks'
    }
  }
})