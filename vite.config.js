import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
          supabase: ['@supabase/supabase-js'],
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
        // Remove console.log, console.info, console.debug, console.trace
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        // Keep console.warn and console.error for critical issues
        passes: 2,
      },
      mangle: {
        // Preserve function names for better error reporting
        keep_fnames: /^(error|warn)$/,
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
      '@supabase/supabase-js'
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
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@design-system': path.resolve(__dirname, './src/design-system'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@config': path.resolve(__dirname, './src/config'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@supabase-config': path.resolve(__dirname, './src/supabase'),
      '@protected-route': path.resolve(__dirname, './src/protectedRoute')
    }
  }
})