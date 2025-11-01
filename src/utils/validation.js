// Form validation utilities
export const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email address is invalid";
    return "";
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Confirm Password is required";
    if (password && confirmPassword !== password) return "Passwords do not match";
    return "";
};

export const validateName = (name) => {
    if (!name.trim()) return "Full Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
};

export const validateTerms = (accepted) => {
    if (!accepted) return "You must accept the Terms & Privacy Policy";
    return "";
};

// Password strength checker
export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    score += checks.length ? 1 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.numbers ? 1 : 0;
    score += checks.special ? 1 : 0;
    
    const strengthMap = {
        0: { label: "Very Weak", color: "text-red-500" },
        1: { label: "Weak", color: "text-orange-500" },
        2: { label: "Fair", color: "text-yellow-500" },
        3: { label: "Good", color: "text-blue-500" },
        4: { label: "Strong", color: "text-green-500" },
        5: { label: "Very Strong", color: "text-emerald-500" }
    };
    
    return { score, ...strengthMap[score] };
};

// Rate limiting utility
export class RateLimiter {
    constructor(maxAttempts = 5, lockoutDuration = 15 * 60 * 1000) {
        this.maxAttempts = maxAttempts;
        this.lockoutDuration = lockoutDuration;
        this.attempts = new Map();
    }
    
    isAllowed(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier);
        
        if (!userAttempts) {
            this.attempts.set(identifier, { count: 0, firstAttempt: now });
            return true;
        }
        
        // Check if lockout period has passed
        if (userAttempts.count >= this.maxAttempts) {
            const timeSinceFirst = now - userAttempts.firstAttempt;
            if (timeSinceFirst < this.lockoutDuration) {
                return false;
            }
            // Reset after lockout period
            this.attempts.set(identifier, { count: 0, firstAttempt: now });
        }
        
        return true;
    }
    
    recordAttempt(identifier) {
        const userAttempts = this.attempts.get(identifier);
        if (userAttempts) {
            userAttempts.count++;
        } else {
            this.attempts.set(identifier, { count: 1, firstAttempt: Date.now() });
        }
    }
    
    getRemainingAttempts(identifier) {
        const userAttempts = this.attempts.get(identifier);
        if (!userAttempts) return this.maxAttempts;
        return Math.max(0, this.maxAttempts - userAttempts.count);
    }
    
    getLockoutTimeRemaining(identifier) {
        const userAttempts = this.attempts.get(identifier);
        if (!userAttempts || userAttempts.count < this.maxAttempts) return 0;
        
        const timeSinceFirst = Date.now() - userAttempts.firstAttempt;
        return Math.max(0, this.lockoutDuration - timeSinceFirst);
    }
    
    resetAttempts(identifier) {
        // Reset attempts counter for successful login
        this.attempts.delete(identifier);
    }
} 