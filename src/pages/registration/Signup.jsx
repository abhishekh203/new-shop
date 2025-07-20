import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================
const VALIDATION_RULES = {
  name: { minLength: 2, maxLength: 50 },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { 
    minLength: 8, 
    patterns: {
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /\d/,
      special: /[!@#$%^&*(),.?":{}|<>]/
    }
  }
};

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  button: {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  }
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================
const validateField = (name, value, confirmPassword = '', hasStartedTyping = false) => {
  switch (name) {
    case 'name':
      if (!hasStartedTyping) return '';
      if (!value.trim()) return 'Please enter your full name';
      if (value.trim().length < VALIDATION_RULES.name.minLength) 
        return `Need ${VALIDATION_RULES.name.minLength - value.trim().length} more characters`;
      if (value.trim().length > VALIDATION_RULES.name.maxLength) 
        return `Name is too long (max ${VALIDATION_RULES.name.maxLength} characters)`;
      return '';

    case 'email':
      if (!hasStartedTyping) return '';
      if (!value) return 'Please enter your email address';
      if (!VALIDATION_RULES.email.pattern.test(value)) 
        return 'Please enter a valid email address';
      return '';

    case 'password':
      if (!hasStartedTyping) return '';
      if (!value) return 'Please create a password';
      if (value.length < VALIDATION_RULES.password.minLength) 
        return `Need ${VALIDATION_RULES.password.minLength - value.length} more characters`;
      
      const { patterns } = VALIDATION_RULES.password;
      if (!patterns.uppercase.test(value)) return 'Add an uppercase letter (A-Z)';
      if (!patterns.lowercase.test(value)) return 'Add a lowercase letter (a-z)';
      if (!patterns.number.test(value)) return 'Add a number (0-9)';
      if (!patterns.special.test(value)) return 'Add a special character (!@#$%^&*)';
      return '';

    case 'confirmPassword':
      if (!hasStartedTyping) return '';
      if (!value) return 'Please confirm your password';
      if (value !== confirmPassword) return 'Passwords do not match';
      return '';

    case 'terms':
      if (!hasStartedTyping) return '';
      return value ? '' : 'Please accept the Terms of Service and Privacy Policy';

    default:
      return '';
  }
};

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Enter password', color: 'text-gray-400' };
  
  let score = 0;
  const { patterns } = VALIDATION_RULES.password;
  
  if (password.length >= 8) score++;
  if (patterns.uppercase.test(password)) score++;
  if (patterns.lowercase.test(password)) score++;
  if (patterns.number.test(password)) score++;
  if (patterns.special.test(password)) score++;
  
  const strengthMap = {
    0: { label: 'Very Weak', color: 'text-red-500' },
    1: { label: 'Weak', color: 'text-red-400' },
    2: { label: 'Fair', color: 'text-yellow-500' },
    3: { label: 'Good', color: 'text-blue-500' },
    4: { label: 'Strong', color: 'text-green-500' },
    5: { label: 'Very Strong', color: 'text-emerald-500' }
  };
  
  return { score, ...strengthMap[score] };
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useFormValidation = (formData) => {
  return useMemo(() => {
    // Show validation errors only when user has started typing in each field
    const errors = {
      name: validateField('name', formData.name, '', formData.name.length > 0),
      email: validateField('email', formData.email, '', formData.email.length > 0),
      password: validateField('password', formData.password, '', formData.password.length > 0),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword, formData.password, formData.confirmPassword.length > 0),
      terms: validateField('terms', formData.terms, '', false) // Only show when form is submitted
    };

    // For form validity, always check all fields (regardless of typing state)
    const actualErrors = {
      name: validateField('name', formData.name, '', true),
      email: validateField('email', formData.email, '', true),
      password: validateField('password', formData.password, '', true),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword, formData.password, true),
      terms: validateField('terms', formData.terms, '', true)
    };

    const isValid = Object.values(actualErrors).every(error => !error) && 
                   Object.values(formData).every(value => 
                     typeof value === 'boolean' ? value : Boolean(value?.toString().trim())
                   );

    return { errors, isValid };
  }, [formData]);
};

const useResponsiveDesign = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isMobile;
};

// ============================================================================
// COMPONENTS
// ============================================================================
const InputField = ({ 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  error, 
  showPassword, 
  onTogglePassword,
  disabled 
}) => (
  <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-300">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
      <input
        id={name}
        name={name}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full pl-10 pr-${type === 'password' ? '12' : '4'} py-3 
          border-2 rounded-xl bg-gray-800/50 text-white placeholder-gray-400
          focus:outline-none focus:ring-2 transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/25' 
            : 'border-gray-600/50 focus:border-blue-500 focus:ring-blue-500/25'
          }
        `}
        autoComplete={type === 'password' ? 'new-password' : name}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-400 flex items-center gap-2"
        >
          <FaTimes className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const PasswordStrengthIndicator = ({ password }) => {
  const strength = getPasswordStrength(password);
  
  if (!password) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Password Strength:</span>
        <span className={`text-xs font-medium ${strength.color}`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength.score <= 1 ? 'bg-red-500' :
            strength.score === 2 ? 'bg-yellow-500' :
            strength.score === 3 ? 'bg-blue-500' :
            strength.score === 4 ? 'bg-green-500' :
            'bg-emerald-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaShieldAlt />
        <span>Use 8+ characters with uppercase, lowercase, numbers & symbols</span>
      </div>
    </motion.div>
  );
};

const TermsCheckbox = ({ checked, onChange, disabled }) => (
  <motion.div variants={ANIMATION_VARIANTS.item} className="flex items-start gap-3">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`
        mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
        ${checked 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'border-gray-400 hover:border-gray-300'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {checked && <FaCheck className="h-3 w-3" />}
    </button>
    <label className="text-sm text-gray-300 leading-relaxed">
      I agree to the{' '}
      <Link 
        to="/terms" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline font-medium"
      >
        Terms of Service
      </Link>
      {' '}and{' '}
      <Link 
        to="/privacy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline font-medium"
      >
        Privacy Policy
      </Link>
    </label>
  </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Signup = () => {
  const navigate = useNavigate();
  const { signup, signupWithGoogle, loading } = useAuth();
  const isMobile = useResponsiveDesign();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { errors, isValid } = useFormValidation(formData);
  
  // Event Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    
    const result = await signup({
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      role: 'user'
    });
    
    if (result.success) {
      toast.success('Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [formData, isValid, loading, signup, navigate]);
  
  const handleGoogleSignup = useCallback(async () => {
    if (loading) return;
    
    const result = await signupWithGoogle();
    if (result.success) {
      toast.success('Account created successfully!');
      setTimeout(() => navigate(result.redirectTo || '/'), 1500);
    }
  }, [loading, signupWithGoogle, navigate]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && isValid && !loading) {
      handleSubmit(e);
    }
  }, [isValid, loading, handleSubmit]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={ANIMATION_VARIANTS.container}
        className={`
          relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl 
          rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden
          ${isMobile ? 'mx-4' : ''}
        `}
      >
        {/* Header */}
        <motion.div 
          variants={ANIMATION_VARIANTS.item}
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-blue-100">Join us and start your journey</p>
          </div>
        </motion.div>
        
        {/* Form */}
        <div className="p-8">
          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={ANIMATION_VARIANTS.container}>
            {/* Google Signup */}
            <motion.button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              variants={ANIMATION_VARIANTS.button}
              whileHover="hover"
              whileTap="tap"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-600 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaGoogle className="text-red-500" />
              )}
              Continue with Google
            </motion.button>
            
            {/* Divider */}
            <motion.div variants={ANIMATION_VARIANTS.item} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
              </div>
            </motion.div>
            
            {/* Form Fields */}
            <InputField
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              icon={FaUser}
              error={errors.name}
              disabled={loading}
            />
            
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              icon={FaEnvelope}
              error={errors.email}
              disabled={loading}
            />
            
            <div className="space-y-3">
              <InputField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                icon={FaLock}
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                disabled={loading}
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>
            
            <InputField
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              icon={FaLock}
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            />
            
            <TermsCheckbox
              checked={formData.terms}
              onChange={(checked) => setFormData(prev => ({ ...prev, terms: checked }))}
              error={errors.terms}
              disabled={loading}
            />
            
            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isValid || loading}
              variants={ANIMATION_VARIANTS.button}
              whileHover={isValid && !loading ? "hover" : "idle"}
              whileTap={isValid && !loading ? "tap" : "idle"}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                ${isValid && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
            
            {/* Login Link */}
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
