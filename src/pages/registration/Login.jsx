import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validation";

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

    const [userLogin, setUserLogin] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [remainingAttempts, setRemainingAttempts] = useState(5);

    // --- Form Validation Effect ---
    useEffect(() => {
        const emailError = validateEmail(userLogin.email);
        const passwordError = validatePassword(userLogin.password);
        setErrors({ email: emailError, password: passwordError });
        setIsFormValid(!emailError && !passwordError && !!userLogin.email && !!userLogin.password);
        
        // Update remaining attempts
        if (userLogin.email) {
            setRemainingAttempts(getRemainingAttempts(userLogin.email));
        }
    }, [userLogin.email, userLogin.password, getRemainingAttempts]);

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserLogin(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
             setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = "";
        if (name === "email") error = validateEmail(value);
        else if (name === "password") error = validatePassword(value);
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
            toast.error(emailError);
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
        
        // Check if user is locked out
        if (isLockedOut(userLogin.email)) {
            const remainingTime = Math.ceil((15 * 60 * 1000) / 60000);
            toast.error(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
                return;
            }

        setErrors({});
        const result = await login(userLogin.email, userLogin.password);
        
        if (result.success) {
            setUserLogin({ email: "", password: "" });
            setTimeout(() => {
                navigate(result.redirectTo);
            }, 1000);
        } else {
            // Handle specific errors
            if (result.error === 'auth/user-not-found' || result.error === 'auth/invalid-email') {
                setErrors(prev => ({ ...prev, email: result.message }));
            } else if (result.error === 'auth/wrong-password') {
                setErrors(prev => ({ ...prev, password: result.message }));
            }
        }
    };

    // --- JSX Structure ---
    return (
        <motion.div
            variants={pageVariants} initial="hidden" animate="visible"
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 font-sans text-gray-200"
        >
            {pageLoading && <Loader />}
            <Toaster position="top-center" reverseOrder={false} toastOptions={{
                 className: '', style: { background: '#333', color: '#fff' },
            }}/>

            <motion.div
                variants={cardVariants} // Apply card animation here
                className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
            >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-8 px-6 text-center">
                    <motion.h2
                        initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-3xl font-bold text-white tracking-tight"
                    > Welcome Back! </motion.h2>
                    <motion.p
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-indigo-100 mt-2 text-sm"
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5"> Email Address </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <input
                                type="email" id="email" name="email" placeholder="you@example.com"
                                value={userLogin.email} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ errors.email ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                autoComplete="email" autoFocus aria-invalid={!!errors.email} aria-describedby="email-error"
                            />
                        </div>
                        <AnimatePresence> {errors.email && ( <motion.p id="email-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="exit"> {errors.email} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="relative"> {/* Apply itemVariants here */}
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300"> Password </label>
                            <button type="button" onClick={handleForgotPassword} disabled={authLoading} className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"> Forgot password? </button>
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
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••••"
                                value={userLogin.password} onChange={handleChange} onBlur={handleBlur} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ errors.password ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="password-error"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800"
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
                    <motion.div variants={itemVariants}> {/* Apply itemVariants here */}
                        <motion.button
                            onClick={userLoginFunction}
                            disabled={!isFormValid || authLoading}
                            whileHover={isFormValid && !authLoading ? { scale: 1.03, filter: 'brightness(1.1)' } : {}}
                            whileTap={isFormValid && !authLoading ? { scale: 0.98 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                            className={`w-full flex justify-center items-center py-3 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out ${ isFormValid && !authLoading ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500' : 'bg-gray-600 cursor-not-allowed opacity-70' }`}
                        >
                            {authLoading ? (
                                <> <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Processing... </>
                            ) : ( 'Sign In' )}
                        </motion.button>
                    </motion.div>

                    {/* Sign-up Link */}
                    <motion.div variants={itemVariants} className="text-center text-sm text-gray-400"> {/* Apply itemVariants here */}
                        New here?{" "}
                        <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition">
                            Create an account <FaArrowRight className="inline ml-1 text-xs" />
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
