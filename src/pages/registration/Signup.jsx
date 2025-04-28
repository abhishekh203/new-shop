import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Signup = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isHoveringSignup, setIsHoveringSignup] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Form validation
    useEffect(() => {
        const errors = {};
        
        if (!userSignup.name.trim()) {
            errors.name = "Name is required";
        }
        
        if (!userSignup.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userSignup.email)) {
            errors.email = "Invalid email format";
        }
        
        if (!userSignup.password) {
            errors.password = "Password is required";
        } else if (userSignup.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        } else if (!/[A-Z]/.test(userSignup.password)) {
            errors.password = "Must contain an uppercase letter";
        } else if (!/[0-9]/.test(userSignup.password)) {
            errors.password = "Must contain a number";
        }
        
        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }, [userSignup]);

    const checkEmailExists = async (email) => {
        const q = query(collection(fireDB, "user"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const userSignupFunction = async () => {
        if (isProcessing || !isFormValid) return;
        
        setIsProcessing(true);
        setLoading(true);

        try {
            if (await checkEmailExists(userSignup.email)) {
                toast.error("This email is already registered");
                return;
            }

            const users = await createUserWithEmailAndPassword(
                auth, 
                userSignup.email, 
                userSignup.password
            );

            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                role: userSignup.role,
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            };

            const userReference = collection(fireDB, "user");
            await addDoc(userReference, user);

            setUserSignup({
                name: "",
                email: "",
                password: "",
                role: "user"
            });

            toast.success("Account created successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Signup error:", error);
            
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email already in use");
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password is too weak");
            } else {
                toast.error("Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
            setIsProcessing(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFormValid) {
            userSignupFunction();
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4"
        >
            {/* Full-page loader overlay */}
            {loading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
                >
                    <Loader />
                </motion.div>
            )}
            
            <div className={`w-full max-w-md transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Create Account</h2>
                        <p className="text-blue-100 mt-2">Start your journey with us</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {/* Name Input */}
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    value={userSignup.name}
                                    onChange={(e) => setUserSignup({ ...userSignup, name: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400`}
                                    autoComplete="name"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            {formErrors.name && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-500"
                                >
                                    {formErrors.name}
                                </motion.p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    value={userSignup.email}
                                    onChange={(e) => setUserSignup({ ...userSignup, email: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400`}
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </div>
                            {formErrors.email && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-500"
                                >
                                    {formErrors.email}
                                </motion.p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    value={userSignup.password}
                                    onChange={(e) => setUserSignup({ ...userSignup, password: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className={`w-full pl-10 pr-10 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400`}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className={`${loading ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700 transition'}`} />
                                    ) : (
                                        <FaEye className={`${loading ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700 transition'}`} />
                                    )}
                                </button>
                            </div>
                            {formErrors.password ? (
                                <motion.p 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-500"
                                >
                                    {formErrors.password}
                                </motion.p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be at least 6 characters with a number and uppercase letter
                                </p>
                            )}
                        </div>

                        {/* Signup Button */}
                        <div className="mb-6">
                            <motion.button
                                onClick={userSignupFunction}
                                onMouseEnter={() => setIsHoveringSignup(true)}
                                onMouseLeave={() => setIsHoveringSignup(false)}
                                disabled={!isFormValid || loading}
                                whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
                                whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                                className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-md transition-all duration-300 ${
                                    isFormValid && !loading
                                        ? isHoveringSignup
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </motion.button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center mb-6">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-3 text-gray-400 text-sm">or sign in instead</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link 
                                    to="/login" 
                                    className={`font-semibold text-blue-600 hover:text-blue-800 hover:underline transition flex items-center justify-center ${loading ? 'pointer-events-none' : ''}`}
                                >
                                    Sign in <FaArrowRight className="ml-1 text-xs" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Signup;