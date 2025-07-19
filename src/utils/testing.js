// Testing utilities and helpers for better application testing

// Mock data generators
export const mockData = {
    // Generate mock user data
    generateUser: (overrides = {}) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        uid: Math.random().toString(36).substr(2, 9),
        time: { seconds: Date.now() / 1000 },
        date: new Date().toISOString(),
        ...overrides
    }),
    
    // Generate mock product data
    generateProduct: (overrides = {}) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: 'Test Product',
        price: 299,
        productImageUrl: '/img/test-product.jpg',
        category: 'streaming',
        categoryId: 'netflix',
        description: 'Test product description',
        quantity: 10,
        featured: false,
        trending: false,
        time: { seconds: Date.now() / 1000 },
        date: new Date().toISOString(),
        ...overrides
    }),
    
    // Generate mock order data
    generateOrder: (overrides = {}) => ({
        id: Math.random().toString(36).substr(2, 9),
        addressInfo: {
            name: 'Test Customer',
            address: 'Test Address',
            whatsappNumber: '+9779800000000',
            mobileNumber: '+9779800000000'
        },
        cartItems: [mockData.generateProduct()],
        email: 'test@example.com',
        userid: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        time: { seconds: Date.now() / 1000 },
        date: new Date().toISOString(),
        ...overrides
    })
};

// Test environment detection
export const testUtils = {
    // Check if running in test environment
    isTestEnvironment: () => {
        return process.env.NODE_ENV === 'test' || 
               typeof global !== 'undefined' && global.__JEST__;
    },
    
    // Mock localStorage for testing
    mockLocalStorage: () => {
        const store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => store[key] = value.toString(),
            removeItem: (key) => delete store[key],
            clear: () => Object.keys(store).forEach(key => delete store[key])
        };
    },
    
    // Mock sessionStorage for testing
    mockSessionStorage: () => {
        return testUtils.mockLocalStorage();
    },
    
    // Mock Firebase for testing
    mockFirebase: () => ({
        auth: {
            currentUser: mockData.generateUser(),
            signInWithEmailAndPassword: jest.fn().mockResolvedValue({
                user: mockData.generateUser()
            }),
            createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
                user: mockData.generateUser()
            }),
            signOut: jest.fn().mockResolvedValue()
        },
        firestore: {
            collection: jest.fn(() => ({
                doc: jest.fn(() => ({
                    get: jest.fn().mockResolvedValue({
                        exists: true,
                        data: () => mockData.generateUser()
                    }),
                    set: jest.fn().mockResolvedValue(),
                    update: jest.fn().mockResolvedValue(),
                    delete: jest.fn().mockResolvedValue()
                })),
                add: jest.fn().mockResolvedValue({
                    id: Math.random().toString(36).substr(2, 9)
                }),
                where: jest.fn(() => ({
                    get: jest.fn().mockResolvedValue({
                        docs: [
                            {
                                id: 'test-id',
                                data: () => mockData.generateUser()
                            }
                        ]
                    })
                }))
            }))
        }
    })
};

// Accessibility testing helpers
export const a11yTestUtils = {
    // Check if element has proper ARIA attributes
    hasProperAria: (element) => {
        const checks = {
            hasRole: element.getAttribute('role') !== null,
            hasLabel: element.getAttribute('aria-label') !== null || 
                     element.getAttribute('aria-labelledby') !== null,
            hasDescription: element.getAttribute('aria-describedby') !== null
        };
        
        return checks;
    },
    
    // Check color contrast
    checkContrast: (backgroundColor, textColor) => {
        // Simplified contrast check for testing
        const bg = backgroundColor.replace('#', '');
        const text = textColor.replace('#', '');
        
        const bgLuminance = parseInt(bg, 16);
        const textLuminance = parseInt(text, 16);
        
        return Math.abs(bgLuminance - textLuminance) > 32768; // Simplified check
    },
    
    // Check for keyboard accessibility
    isKeyboardAccessible: (element) => {
        return element.tabIndex >= 0 || 
               ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
    }
};

// Performance testing utilities
export const performanceUtils = {
    // Measure component render time
    measureRenderTime: (componentName, renderFn) => {
        const start = performance.now();
        const result = renderFn();
        const end = performance.now();
        
        console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
        return result;
    },
    
    // Check bundle size
    checkBundleSize: () => {
        if (typeof window !== 'undefined') {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            
            return {
                scriptCount: scripts.length,
                styleCount: styles.length,
                // Note: Actual size would need to be measured differently
                estimatedSize: scripts.length * 50 + styles.length * 20 // Rough estimate
            };
        }
        
        return null;
    },
    
    // Memory usage tracking
    trackMemoryUsage: () => {
        if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
            return {
                used: window.performance.memory.usedJSHeapSize,
                total: window.performance.memory.totalJSHeapSize,
                limit: window.performance.memory.jsHeapSizeLimit
            };
        }
        
        return null;
    }
};

// Error boundary testing
export const errorTestUtils = {
    // Trigger component error for testing
    triggerError: (message = 'Test error') => {
        throw new Error(message);
    },
    
    // Mock console errors for testing
    mockConsoleError: () => {
        const originalError = console.error;
        const errors = [];
        
        console.error = (...args) => {
            errors.push(args);
        };
        
        return {
            getErrors: () => errors,
            restore: () => {
                console.error = originalError;
            }
        };
    }
};

// Network testing utilities
export const networkTestUtils = {
    // Mock fetch for testing
    mockFetch: (response = {}, status = 200) => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: status >= 200 && status < 300,
                status,
                json: () => Promise.resolve(response),
                text: () => Promise.resolve(JSON.stringify(response))
            })
        );
    },
    
    // Simulate network failure
    simulateNetworkFailure: () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Network error'))
        );
    },
    
    // Mock online/offline status
    mockNetworkStatus: (isOnline = true) => {
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: isOnline
        });
        
        // Trigger network events
        window.dispatchEvent(new Event(isOnline ? 'online' : 'offline'));
    }
};

// Form testing utilities
export const formTestUtils = {
    // Fill form with test data
    fillForm: (formElement, data) => {
        Object.entries(data).forEach(([name, value]) => {
            const input = formElement.querySelector(`[name="${name}"]`);
            if (input) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = value;
                } else {
                    input.value = value;
                }
                
                // Trigger change event
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    },
    
    // Submit form programmatically
    submitForm: (formElement) => {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        formElement.dispatchEvent(submitEvent);
    },
    
    // Validate form accessibility
    validateFormA11y: (formElement) => {
        const issues = [];
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Check for labels
            const label = formElement.querySelector(`label[for="${input.id}"]`) ||
                          input.closest('label');
            if (!label) {
                issues.push(`Missing label for input: ${input.name || input.id}`);
            }
            
            // Check required fields have proper indication
            if (input.required && !input.getAttribute('aria-required')) {
                issues.push(`Required field missing aria-required: ${input.name || input.id}`);
            }
        });
        
        return issues;
    }
};

// Wait utilities for async testing
export const waitUtils = {
    // Wait for element to appear
    waitForElement: (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Wait for condition to be true
    waitForCondition: (condition, timeout = 5000, interval = 100) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const check = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Condition not met within ${timeout}ms`));
                } else {
                    setTimeout(check, interval);
                }
            };
            
            check();
        });
    }
};

export default {
    mockData,
    testUtils,
    a11yTestUtils,
    performanceUtils,
    errorTestUtils,
    networkTestUtils,
    formTestUtils,
    waitUtils
}; 