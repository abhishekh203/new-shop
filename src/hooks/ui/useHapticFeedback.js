import { useCallback } from 'react';

/**
 * Custom hook for haptic feedback on mobile devices
 * @returns {Object} - Object containing haptic feedback function
 */
const useHapticFeedback = () => {
  const triggerHapticFeedback = useCallback(() => {
    // Check if device supports vibration and is mobile
    if ('vibrate' in navigator && window.innerWidth < 768) {
      // Short vibration for button clicks
      navigator.vibrate(50);
    }
  }, []);

  return { triggerHapticFeedback };
};

export default useHapticFeedback;
