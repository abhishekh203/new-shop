import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+",
  onLoad,
  onError,
  priority = false,
  sizes,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
    
    // Set fallback image
    e.target.src = "https://via.placeholder.com/300x200/1f2937/9ca3af?text=Image+Not+Found";
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || baseSrc.includes('placeholder') || baseSrc.includes('data:')) {
      return undefined;
    }
    
    // For external images, return as is
    if (baseSrc.startsWith('http')) {
      return undefined;
    }
    
    // For local images, you could implement different sizes
    // This is a simplified version - in production, you'd have actual optimized images
    return undefined;
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <motion.div
          className="absolute inset-0 bg-gray-800 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse">
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      )}

      {/* Actual image */}
      {(isInView || priority) && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : loading}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
          <div className="text-center">
            <div className="mb-2">⚠️</div>
            <div>Image failed to load</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
