import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext"; // Assuming context path is correct
import { Timestamp, addDoc, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore"; // Added setDoc
import { auth, fireDB } from "../../firebase/FirebaseConfig"; // Assuming Firebase config path is correct
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast"; // Using react-hot-toast
import Loader from "../../components/loader/Loader"; // Assuming Loader path is correct
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckSquare, FaRegSquare, FaSpinner } from "react-icons/fa"; // Using react-icons
import { motion, AnimatePresence } from "framer-motion";

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
            // *** Note: Stagger is now applied via containerVariants on the form div below ***
        }
    },
};

// *** FIX: Define containerVariants for staggering form items ***
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delay: 0.2, // Start slightly after card animation
            staggerChildren: 0.08, // Stagger children entry
        },
    },
};
// *** END FIX ***

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const errorVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 2, height: 0, transition: { duration: 0.2, ease: 'easeIn' } }
};

// --- Component ---
const Signup = () => {
    const context = useContext(myContext);
    const { loading: pageLoading, setLoading: setPageLoading } = context;
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [userSignup, setUserSignup] = useState({
        name: "", email: "", password: "", confirmPassword: "",
        termsAccepted: false, role: "user",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // --- Form validation ---
    useEffect(() => {
        const errors = {};
        if (!userSignup.name.trim()) errors.name = "Full Name is required";
        if (!userSignup.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userSignup.email)) errors.email = "Invalid email format";
        if (!userSignup.password) errors.password = "Password is required";
        else if (userSignup.password.length < 6) errors.password = "Password must be at least 6 characters";
        else if (!/[A-Z]/.test(userSignup.password)) errors.password = "Must contain an uppercase letter";
        else if (!/[0-9]/.test(userSignup.password)) errors.password = "Must contain a number";
        if (!userSignup.confirmPassword) errors.confirmPassword = "Confirm Password is required";
        else if (userSignup.password && userSignup.confirmPassword !== userSignup.password) errors.confirmPassword = "Passwords do not match";
        if (!userSignup.termsAccepted) errors.terms = "You must accept the Terms & Privacy Policy";

        setFormErrors(errors);
        const allFieldsFilled = Object.entries(userSignup).every(([key, val]) => key === 'role' || (typeof val === 'boolean' ? val === true : !!String(val).trim()));
        setIsFormValid(Object.keys(errors).length === 0 && allFieldsFilled);

    }, [userSignup]);

    // --- Helper Functions ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        const processedValue = (name === 'name' || name === 'email') ? val : val;
        const finalValue = name === 'email' ? processedValue.toLowerCase() : processedValue;

        setUserSignup(prev => ({ ...prev, [name]: finalValue }));
        if (formErrors[name]) {
             setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const checkEmailExists = async (email) => {
        const q = query(collection(fireDB, "user"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFormValid && !isProcessing) {
            userSignupFunction();
        }
    };

    // --- Signup Function ---
    const userSignupFunction = async () => {
        if (!isFormValid || isProcessing) return;

        setIsProcessing(true);
        setPageLoading(true);
        setFormErrors({});

        try {
            if (await checkEmailExists(userSignup.email)) {
                toast.error("This email address is already registered.");
                setFormErrors(prev => ({ ...prev, email: "Email already registered" }));
                setPageLoading(false);
                setIsProcessing(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);
            const firebaseUser = userCredential.user;

            const userData = {
                name: userSignup.name.trim(),
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toISOString(),
                emailVerified: firebaseUser.emailVerified || false,
            };

            const userRef = doc(fireDB, "user", firebaseUser.uid);
            await setDoc(userRef, userData);

            setUserSignup({ name: "", email: "", password: "", confirmPassword: "", termsAccepted: false, role: "user" });
            setShowPassword(false);
            setShowConfirmPassword(false);

            toast.success("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate('/login'), 1500);

        } catch (error) {
            console.error("Signup error:", error, error.code);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email already in use by another account.");
                setFormErrors(prev => ({ ...prev, email: "Email already in use" }));
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password is too weak.");
                setFormErrors(prev => ({ ...prev, password: "Password is too weak" }));
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email format.");
                setFormErrors(prev => ({ ...prev, email: "Invalid email format" }));
            } else {
                toast.error("Signup failed. Please try again.");
            }
        } finally {
            setPageLoading(false);
            setIsProcessing(false);
        }
    };

    // --- JSX Structure ---
    return (
        <motion.div
            variants={pageVariants} initial="hidden" animate="visible"
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 font-sans text-gray-200"
        >
            {pageLoading && !isProcessing && <Loader />}
            <Toaster position="top-center" reverseOrder={false} toastOptions={{
                 className: '', style: { background: '#333', color: '#fff' },
            }}/>

            <motion.div
                variants={cardVariants} initial="hidden" animate="visible"
                className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
            >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-8 px-6 text-center relative overflow-hidden">
                    <motion.div initial={{ scale:0, opacity: 0}} animate={{ scale:1, opacity: 0.1}} transition={{delay: 0.5, duration: 1}} className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full opacity-10"></motion.div>
                    <motion.div initial={{ scale:0, opacity: 0}} animate={{ scale:1, opacity: 0.1}} transition={{delay: 0.7, duration: 1}} className="absolute -bottom-12 -right-8 w-24 h-24 bg-white rounded-full opacity-10"></motion.div>
                    <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 120 }} className="text-3xl font-bold text-white relative z-10 tracking-tight"> Create Account </motion.h2>
                    <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }} className="text-indigo-100 mt-2 relative z-10 text-sm"> Join us and start exploring! </motion.p>
                </div>

                {/* Form Area */}
                <motion.div
                    className="p-8 space-y-5"
                    variants={containerVariants} // Apply container variants for staggering children
                    initial="hidden"
                    animate="visible"
                >
                    {/* --- Name Input --- */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5"> Full Name </label>
                        <div className="relative">
                            <motion.div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" animate={{ scale: focusedField === 'name' ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                                <FaUser className={`transition-colors h-4 w-4 ${focusedField === 'name' ? 'text-indigo-400' : 'text-gray-400'}`} />
                            </motion.div>
                            <input type="text" id="name" placeholder="e.g., John Doe" value={userSignup.name} onChange={handleChange} name="name" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.name ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                autoComplete="name" disabled={isProcessing} autoFocus aria-invalid={!!formErrors.name} aria-describedby={formErrors.name ? "name-error" : undefined}
                            />
                        </div>
                        <AnimatePresence> {formErrors.name && ( <motion.p id="name-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden"> {formErrors.name} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* --- Email Input --- */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5"> Email Address </label>
                        <div className="relative">
                             <motion.div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" animate={{ scale: focusedField === 'email' ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                                <FaEnvelope className={`transition-colors h-4 w-4 ${focusedField === 'email' ? 'text-indigo-400' : 'text-gray-400'}`} />
                             </motion.div>
                            <input type="email" id="email" placeholder="your@email.com" value={userSignup.email} onChange={handleChange} name="email" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.email ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                autoComplete="email" disabled={isProcessing} aria-invalid={!!formErrors.email} aria-describedby={formErrors.email ? "email-error" : undefined}
                            />
                        </div>
                        <AnimatePresence> {formErrors.email && ( <motion.p id="email-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden"> {formErrors.email} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* --- Password Input --- */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5"> Password </label>
                        <div className="relative">
                             <motion.div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" animate={{ scale: focusedField === 'password' ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                                <FaLock className={`transition-colors h-4 w-4 ${focusedField === 'password' ? 'text-indigo-400' : 'text-gray-400'}`} />
                             </motion.div>
                            <input type={showPassword ? "text" : "password"} id="password" placeholder="••••••••" value={userSignup.password} onChange={handleChange} name="password" onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.password ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                autoComplete="new-password" disabled={isProcessing} aria-invalid={!!formErrors.password} aria-describedby={formErrors.password ? "password-error" : "password-hint"}
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition" onClick={() => setShowPassword(!showPassword)} disabled={isProcessing} aria-label={showPassword ? "Hide password" : "Show password"}> {showPassword ? <FaEyeSlash /> : <FaEye />} </button>
                        </div>
                        <AnimatePresence>
                            {formErrors.password ? (
                                <motion.p id="password-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden"> {formErrors.password} </motion.p>
                            ) : (
                                <p id="password-hint" className="mt-1.5 text-xs text-gray-500"> Min 6 chars, 1 uppercase, 1 number. </p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* --- Confirm Password Input --- */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5"> Confirm Password </label>
                        <div className="relative">
                             <motion.div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" animate={{ scale: focusedField === 'confirmPassword' ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                                <FaLock className={`transition-colors h-4 w-4 ${focusedField === 'confirmPassword' ? 'text-indigo-400' : 'text-gray-400'}`} />
                             </motion.div>
                            <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="••••••••" value={userSignup.confirmPassword} onChange={handleChange} name="confirmPassword" onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} onKeyPress={handleKeyPress}
                                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                autoComplete="new-password" disabled={isProcessing} aria-invalid={!!formErrors.confirmPassword} aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isProcessing} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}> {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} </button>
                        </div>
                        <AnimatePresence> {formErrors.confirmPassword && ( <motion.p id="confirmPassword-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden"> {formErrors.confirmPassword} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* --- Terms Checkbox --- */}
                    <motion.div variants={itemVariants} className="pt-1">
                        <div className="flex items-start">
                            <button
                                type="button"
                                onClick={() => setUserSignup({ ...userSignup, termsAccepted: !userSignup.termsAccepted })}
                                className={`mr-2.5 mt-0.5 text-xl transition-colors ${userSignup.termsAccepted ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-500'}`}
                                disabled={isProcessing} aria-pressed={userSignup.termsAccepted} aria-label="Accept Terms of Service"
                            > {userSignup.termsAccepted ? <FaCheckSquare /> : <FaRegSquare />} </button>
                            <label htmlFor="terms" className="text-sm text-gray-400">
                                I agree to the{' '}
                                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-400 hover:text-indigo-300 underline"> Terms of Service </Link>
                                {' '}and{' '}
                                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-400 hover:text-indigo-300 underline"> Privacy Policy </Link>.
                            </label>
                            <input type="checkbox" id="terms" name="termsAccepted" checked={userSignup.termsAccepted} onChange={handleChange} className="sr-only" />
                        </div>
                        <AnimatePresence> {formErrors.terms && ( <motion.p className="mt-1.5 text-xs text-red-400 pl-8" variants={errorVariants} initial="hidden" animate="visible" exit="hidden"> {formErrors.terms} </motion.p> )} </AnimatePresence>
                    </motion.div>

                    {/* --- Signup Button --- */}
                    <motion.div variants={itemVariants} className="pt-2">
                        <motion.button
                            onClick={userSignupFunction}
                            disabled={!isFormValid || isProcessing}
                            whileHover={isFormValid && !isProcessing ? { scale: 1.03, filter: 'brightness(1.1)' } : {}}
                            whileTap={isFormValid && !isProcessing ? { scale: 0.98 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                            className={`w-full flex justify-center items-center py-3 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out ${ isFormValid && !isProcessing ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500' : 'bg-gray-600 cursor-not-allowed opacity-70' }`}
                        >
                            {isProcessing ? (
                                <> <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Creating Account... </>
                            ) : ( 'Create Account' )}
                        </motion.button>
                    </motion.div>

                    {/* --- Divider --- */}
                    <motion.div variants={itemVariants} className="flex items-center pt-2">
                        <div className="flex-1 border-t border-gray-600/50"></div>
                        <span className="px-3 text-gray-500 text-sm">Already have an account?</span>
                        <div className="flex-1 border-t border-gray-600/50"></div>
                    </motion.div>

                    {/* --- Login Link --- */}
                    <motion.div variants={itemVariants} className="text-center">
                        <Link
                            to="/login"
                            className={`inline-flex items-center justify-center font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200 ${isProcessing ? 'pointer-events-none opacity-70' : ''}`}
                        >
                            Sign in Instead <FaArrowRight className="inline ml-1.5 text-xs" />
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Signup;
