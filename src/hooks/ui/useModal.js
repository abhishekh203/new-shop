import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for modal state management
 * Provides consistent modal behavior with keyboard support and body scroll lock
 * @param {Object} options - Configuration options
 * @param {boolean} options.closeOnEscape - Whether to close modal on Escape key (default: true)
 * @param {boolean} options.closeOnOutsideClick - Whether to close on outside click (default: true)
 * @param {boolean} options.lockBodyScroll - Whether to lock body scroll when modal is open (default: true)
 * @param {Function} options.onOpen - Callback when modal opens
 * @param {Function} options.onClose - Callback when modal closes
 * @returns {Object} - Modal state and control methods
 */
const useModal = (options = {}) => {
  const {
    closeOnEscape = true,
    closeOnOutsideClick = true,
    lockBodyScroll = true,
    onOpen,
    onClose
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  // Open modal with optional data
  const openModal = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
    if (onOpen) onOpen(modalData);
  }, [onOpen]);

  // Close modal and clear data
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
    if (onClose) onClose();
  }, [onClose]);

  // Toggle modal state
  const toggleModal = useCallback((modalData = null) => {
    if (isOpen) {
      closeModal();
    } else {
      openModal(modalData);
    }
  }, [isOpen, openModal, closeModal]);

  // Handle escape key press
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, closeModal]);

  // Handle body scroll lock
  useEffect(() => {
    if (!lockBodyScroll) return;

    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, lockBodyScroll]);

  // Create outside click handler
  const createOutsideClickHandler = useCallback((modalRef) => {
    if (!closeOnOutsideClick) return () => {};

    return (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
  }, [closeOnOutsideClick, closeModal]);

  return {
    // State
    isOpen,
    data,
    
    // Actions
    openModal,
    closeModal,
    toggleModal,
    
    // Utilities
    createOutsideClickHandler,
    
    // Modal props (for easy spreading)
    modalProps: {
      isOpen,
      onClose: closeModal,
      data
    }
  };
};

export default useModal;
