// Accessibility utilities for WCAG compliance and better UX

// Screen reader utilities
export const screenReader = {
    // Announce content to screen readers
    announce: (message, priority = 'polite') => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },
    
    // Update page title for navigation
    updatePageTitle: (title) => {
        document.title = `${title} - Digital Shop Nepal`;
        screenReader.announce(`Navigated to ${title}`);
    }
};

// Keyboard navigation utilities
export const keyboardUtils = {
    // Trap focus within element
    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                element.dispatchEvent(new CustomEvent('escape-key'));
            }
        };
        
        element.addEventListener('keydown', handleTabKey);
        firstElement?.focus();
        
        return () => element.removeEventListener('keydown', handleTabKey);
    },
    
    // Skip link for main content
    createSkipLink: () => {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView();
            }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
};

// Color contrast utilities
export const colorUtils = {
    // Calculate color contrast ratio
    getContrastRatio: (color1, color2) => {
        const getLuminance = (color) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            
            const [r, g, b] = rgb.map(c => {
                c = parseInt(c) / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    },
    
    // Check if color combination meets WCAG standards
    meetsWCAG: (backgroundColor, textColor, level = 'AA') => {
        const ratio = colorUtils.getContrastRatio(backgroundColor, textColor);
        const requirements = {
            'AA': 4.5,
            'AAA': 7
        };
        
        return ratio >= requirements[level];
    }
};

// Form accessibility utilities
export const formUtils = {
    // Add proper labels and ARIA attributes
    enhanceForm: (formElement) => {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add required attribute description
            if (input.hasAttribute('required') && !input.getAttribute('aria-describedby')) {
                const requiredId = `${input.id || input.name}-required`;
                const requiredText = document.createElement('span');
                requiredText.id = requiredId;
                requiredText.className = 'sr-only';
                requiredText.textContent = 'This field is required';
                input.parentNode.appendChild(requiredText);
                input.setAttribute('aria-describedby', requiredId);
            }
            
            // Add error message association
            const errorElement = formElement.querySelector(`[data-error-for="${input.name}"]`);
            if (errorElement) {
                const errorId = `${input.id || input.name}-error`;
                errorElement.id = errorId;
                const describedBy = input.getAttribute('aria-describedby');
                input.setAttribute('aria-describedby', 
                    describedBy ? `${describedBy} ${errorId}` : errorId
                );
                input.setAttribute('aria-invalid', 'true');
            }
        });
    },
    
    // Validate form accessibility
    validateFormA11y: (formElement) => {
        const issues = [];
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Check for labels
            const label = formElement.querySelector(`label[for="${input.id}"]`) ||
                          input.closest('label');
            if (!label && !input.getAttribute('aria-label')) {
                issues.push(`Input ${input.name || input.id} missing label`);
            }
            
            // Check for fieldsets on radio/checkbox groups
            if (input.type === 'radio' || input.type === 'checkbox') {
                const fieldset = input.closest('fieldset');
                if (!fieldset) {
                    issues.push(`${input.type} group should be in fieldset`);
                }
            }
        });
        
        return issues;
    }
};

// Image accessibility utilities
export const imageUtils = {
    // Generate meaningful alt text suggestions
    generateAltText: (imageSrc, context = '') => {
        const filename = imageSrc.split('/').pop().split('.')[0];
        
        if (filename.includes('logo')) {
            return `${context} logo`;
        }
        if (filename.includes('icon')) {
            return `${context} icon`;
        }
        if (filename.includes('product')) {
            return `${context} product image`;
        }
        
        return `${context} ${filename.replace(/[-_]/g, ' ')}`;
    },
    
    // Check for decorative images
    isDecorative: (imageSrc) => {
        const decorativePatterns = ['decoration', 'background', 'spacer', 'divider'];
        return decorativePatterns.some(pattern => 
            imageSrc.toLowerCase().includes(pattern)
        );
    }
};

// Motion and animation accessibility
export const motionUtils = {
    // Check user motion preferences
    prefersReducedMotion: () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Create motion-safe animation configs
    getSafeAnimationConfig: (normalConfig, reducedConfig = {}) => {
        if (motionUtils.prefersReducedMotion()) {
            return {
                ...normalConfig,
                duration: 0,
                delay: 0,
                ...reducedConfig
            };
        }
        return normalConfig;
    },
    
    // Auto-pause animations if user prefers reduced motion
    respectMotionPreferences: () => {
        if (motionUtils.prefersReducedMotion()) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// ARIA utilities
export const ariaUtils = {
    // Manage ARIA expanded states
    toggleExpanded: (button, content) => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        
        if (content) {
            content.style.display = isExpanded ? 'none' : 'block';
        }
        
        return !isExpanded;
    },
    
    // Create ARIA live regions
    createLiveRegion: (type = 'polite') => {
        const region = document.createElement('div');
        region.setAttribute('aria-live', type);
        region.setAttribute('aria-atomic', 'true');
        region.className = 'sr-only';
        document.body.appendChild(region);
        
        return {
            announce: (message) => {
                region.textContent = message;
            },
            destroy: () => {
                document.body.removeChild(region);
            }
        };
    }
};

// Initialize accessibility features
export const initializeA11y = () => {
    // Create skip link
    keyboardUtils.createSkipLink();
    
    // Respect motion preferences
    motionUtils.respectMotionPreferences();
    
    // Add focus-visible polyfill behavior
    const addFocusVisible = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    };
    
    addFocusVisible();
    
    // Add high contrast mode detection
    const checkHighContrast = () => {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    };
    
    checkHighContrast();
};

export default {
    screenReader,
    keyboardUtils,
    colorUtils,
    formUtils,
    imageUtils,
    motionUtils,
    ariaUtils,
    initializeA11y
}; 