import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validation";
import { serifTheme } from "../../design-system/themes/serifTheme";
import { SerifButton, SerifPageWrapper } from "../../design-system/components";
import { useNotification } from "../../context/NotificationContext";

// --- Animation Variants ---
const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
        y: 0, opacity: 1, scale: 1,
        transition: {
            delay: 0.1,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
            // Stagger children animations within the card
            staggerChildren: 0.1
        }
    },
};

// *** FIX: Define itemVariants for form elements ***
const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
// *** END FIX ***

const errorVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 2, height: 0, transition: { duration: 0.2, ease: 'easeIn' } }
};

// --- Component ---
const Login = () => {
    const context = useContext(myContext);
    const { loading: pageLoading, setLoading: setPageLoading } = context;
    const navigate = useNavigate();
    const { login, resetPassword, loading: authLoading, progress, getRemainingAttempts, isLockedOut } = useAuth();
    const notification = useNotification();

    const [userLogin, setUserLogin] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [remainingAttempts, setRemainingAttempts] = useState(5);
    const [touchedFields, setTouchedFields] = useState({ email: false, password: false });

    // --- Form Validation Effect ---
    useEffect(() => {
        // Only validate for form validity check, don't show errors until touched
        const emailError = userLogin.email ? validateEmail(userLogin.email) : "";
        const passwordError = userLogin.password ? validatePassword(userLogin.password) : "";
        
        // Only set errors if field has been touched
        const newErrors = {};
        if (touchedFields.email) {
            newErrors.email = emailError;
        }
        if (touchedFields.password) {
            newErrors.password = passwordError;
        }
        
        setErrors(newErrors);
        setIsFormValid(!emailError && !passwordError && !!userLogin.email && !!userLogin.password);
        
        // Update remaining attempts
        if (userLogin.email) {
            setRemainingAttempts(getRemainingAttempts(userLogin.email));
        }
    }, [userLogin.email, userLogin.password, touchedFields, getRemainingAttempts]);

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserLogin(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        let error = "";
        if (name === "email") {
            error = value ? validateEmail(value) : "Email is required";
        } else if (name === "password") {
            error = value ? validatePassword(value) : "Password is required";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFormValid && !authLoading) {
            userLoginFunction();
        }
    };

    // --- Forgot Password ---
    const handleForgotPassword = async () => {
        const emailError = validateEmail(userLogin.email);
        if (emailError) {
            setErrors(prev => ({ ...prev, email: emailError }));
            notification.error(emailError);
            return;
        }
        
        const result = await resetPassword(userLogin.email);
        if (!result.success) {
            setErrors(prev => ({ ...prev, email: result.message }));
        }
    };

    // --- Login Function ---
    const userLoginFunction = async () => {
        if (!isFormValid || authLoading) return;
        
        // Mark all fields as touched on submit attempt
        setTouchedFields({ email: true, password: true });
        
        // Validate before submitting
        const emailError = userLogin.email ? validateEmail(userLogin.email) : "Email is required";
        const passwordError = userLogin.password ? validatePassword(userLogin.password) : "Password is required";
        
        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }
        
        // Check if user is locked out
        if (isLockedOut(userLogin.email)) {
            const remainingTime = Math.ceil((15 * 60 * 1000) / 60000);
            notification.error(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
            return;
        }

        setErrors({});
        const result = await login(userLogin.email, userLogin.password);
        
        if (result.success) {
            setUserLogin({ email: "", password: "" });
            setTouchedFields({ email: false, password: false });
            // Navigate immediately without delay
            navigate(result.redirectTo);
        } else {
            // Handle specific errors - Firebase now uses auth/invalid-credential for wrong password
            if (result.error === 'auth/user-not-found') {
                setErrors(prev => ({ ...prev, email: result.message || "No account found with this email" }));
            } else if (result.error === 'auth/invalid-email') {
                setErrors(prev => ({ ...prev, email: result.message || "Invalid email format" }));
            } else if (result.error === 'auth/wrong-password') {
                setErrors(prev => ({ ...prev, password: result.message || "Incorrect password. Please try again." }));
            } else if (result.error === 'auth/invalid-credential') {
                // Firebase returns invalid-credential for both wrong email and wrong password
                // Since we've validated email format, this is likely wrong password
                // But we'll show it on password field since email format is valid
                const emailValid = validateEmail(userLogin.email) === "";
                if (emailValid) {
                    // Email format is valid, so it's likely wrong password
                    setErrors(prev => ({ ...prev, password: result.message || "Incorrect password. Please try again." }));
                } else {
                    // Email format is invalid, show on email
                    setErrors(prev => ({ ...prev, email: result.message || "Invalid email or password" }));
                }
            } else {
                // Generic error - show notification
                notification.error(result.message || "Login failed. Please try again.");
            }
        }
    };

    // --- JSX Structure ---
    return (
        <SerifPageWrapper>
            <motion.div
                variants={pageVariants} initial="hidden" animate="visible"
                className="flex justify-center items-center min-h-screen p-4 relative overflow-hidden"
                style={{ fontFamily: serifTheme.fontFamily.serif }}
            >
                {pageLoading && <Loader />}

                <motion.div
                    variants={cardVariants}
                    className={`w-full max-w-md ${serifTheme.gradients.card} backdrop-blur-lg ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} overflow-hidden border ${serifTheme.colors.border.primary}`}
                >
                {/* Card Header */}
                <div className={`${serifTheme.gradients.button} py-8 px-6 text-center`}>
                    <motion.h2
                        initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                        className={`text-3xl font-bold ${serifTheme.colors.text.buttonPrimary} tracking-tight`}
                    > Welcome Back! </motion.h2>
                    <motion.p
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
                        className={`${serifTheme.colors.text.buttonPrimary} opacity-90 mt-2 text-sm`}
                    > Sign in to continue. </motion.p>
                </div>

                {/* Form Area */}
                <motion.div
                    // Apply itemVariants to the form container to stagger its children
                    variants={itemVariants}
                    className="p-8 space-y-6"
                 >
                    {/* Email Input */}
                    <motion.div variants={itemVariants} className="relative"> {/* Apply itemVariants here */}
                        <label htmlFor="email" className={`block text-sm font-medium ${serifTheme.colors.text.secondary} mb-1.5`}> Email Address </label>
                        <div className="relative">
                            <FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${serifTheme.colors.text.tertiary} pointer-events-none`} />
                            <input
                                type="email" id="email" name="email" placeholder="you@example.com"
                                value={userLogin.email} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-4 py-2.5 border ${serifTheme.radius.button} focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} placeholder-amber-400/50 ${ errors.email ? `border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50` : `${serifTheme.colors.border.secondary} focus:ring-amber-500/50 focus:border-amber-500/50` }`}
                                autoComplete="email" autoFocus aria-invalid={!!errors.email} aria-describedby="email-error"
                            />
                        </div>
                        <AnimatePresence> {errors.email && ( <motion.p id="email-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="exit"> {errors.email} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="relative"> {/* Apply itemVariants here */}
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="password" className={`block text-sm font-medium ${serifTheme.colors.text.secondary}`}> Password </label>
                            <button type="button" onClick={handleForgotPassword} disabled={authLoading} className={`text-xs font-medium ${serifTheme.colors.text.accent} hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed`}> Forgot password? </button>
                        </div>
                        
                        {/* Security Status */}
                        {userLogin.email && (
                            <motion.div 
                                initial={{ opacity: 0, y: -5 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="flex items-center gap-2 mb-2"
                            >
                                <FaShieldAlt className={`text-xs ${remainingAttempts <= 2 ? 'text-red-400' : remainingAttempts <= 3 ? 'text-yellow-400' : 'text-green-400'}`} />
                                <span className={`text-xs ${remainingAttempts <= 2 ? 'text-red-400' : remainingAttempts <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {remainingAttempts} login attempts remaining
                                </span>
                            </motion.div>
                        )}
                        <div className="relative">
                            <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${serifTheme.colors.text.tertiary} pointer-events-none`} />
                            <input
                                type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••••"
                                value={userLogin.password} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-10 py-2.5 border ${serifTheme.radius.button} focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} placeholder-amber-400/50 ${ errors.password ? `border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50` : `${serifTheme.colors.border.secondary} focus:ring-amber-500/50 focus:border-amber-500/50` }`}
                                autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="password-error"
                            />
                            <button
                                type="button"
                                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${serifTheme.colors.text.tertiary} hover:text-amber-800 transition rounded-r-lg focus:outline-none focus:ring-1 focus:ring-amber-500`}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            > {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />} </button>
                        </div>
                        <AnimatePresence> {errors.password && ( <motion.p id="password-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="exit"> {errors.password} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* Progress Indicator */}
                    {authLoading && progress > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }}
                            className="w-full bg-gray-700 rounded-full h-2 mb-4"
                        >
                            <motion.div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>
                    )}

                    {/* Login Button */}
                    <motion.div variants={itemVariants}>
                        <SerifButton
                            onClick={userLoginFunction}
                            disabled={!isFormValid || authLoading}
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={authLoading}
                            icon={authLoading ? undefined : <FaArrowRight />}
                        >
                            {authLoading ? 'Processing...' : 'Sign In'}
                        </SerifButton>
                    </motion.div>

                    {/* Sign-up Link */}
                    <motion.div variants={itemVariants} className={`text-center text-sm ${serifTheme.colors.text.tertiary}`}>
                        New here?{" "}
                        <Link to="/signup" className={`font-medium ${serifTheme.colors.text.accent} hover:underline transition`}>
                            Create an account <FaArrowRight className="inline ml-1 text-xs" />
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
        </SerifPageWrapper>
    );
};

export default Login;
