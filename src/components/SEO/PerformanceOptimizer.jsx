import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      fontLink.as = 'style';
      fontLink.onload = function() { this.onload = null; this.rel = 'stylesheet'; };
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        '/img/digital.jpg',
        '/img/hero.png',
        '/img/netflix.png',
        '/img/spotify.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Optimize images with lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Remove unused CSS (simplified version)
    const removeUnusedCSS = () => {
      // This is a simplified version - in production, use tools like PurgeCSS
      const unusedSelectors = [
        '.unused-class',
        '.old-component'
      ];

      unusedSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach(script => {
        script.defer = true;
      });
    };

    // Add performance monitoring
    const addPerformanceMonitoring = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            // Log performance metrics (in production, send to analytics)
            // Performance metrics can be sent to analytics service here
          }, 0);
        });
      }
    };

    // Service Worker registration for caching
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              // Service worker registered successfully
            })
            .catch(registrationError => {
                              // Service worker registration failed
            });
        });
      }
    };

    // Execute optimizations
    preloadCriticalResources();
    optimizeImages();
    removeUnusedCSS();
    optimizeThirdPartyScripts();
    addPerformanceMonitoring();
    // registerServiceWorker(); // Uncomment when you have a service worker

    // Cleanup function
    return () => {
      // Clean up any observers or listeners if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
