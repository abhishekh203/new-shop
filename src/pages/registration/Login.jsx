import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isHoveringLogin, setIsHoveringLogin] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // Validate form on input change
    useEffect(() => {
        const isValid = 
            userLogin.email && 
            userLogin.password && 
            /\S+@\S+\.\S+/.test(userLogin.email) && 
            userLogin.password.length >= 6;
        setIsFormValid(isValid);
    }, [userLogin.email, userLogin.password]);

    const handleForgotPassword = async () => {
        if (!userLogin.email) {
            toast.error("Please enter your email first");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(userLogin.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, userLogin.email);
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error) {
            console.error("Password reset error:", error);
            if (error.code === 'auth/user-not-found') {
                toast.error("No account found with this email");
            } else {
                toast.error("Failed to send password reset email");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFormValid) {
            userLoginFunction();
        }
    };

    const userLoginFunction = async () => {
        if (!isFormValid) return;

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                userLogin.email, 
                userLogin.password
            );
            
            const q = query(
                collection(fireDB, "user"), 
                where('uid', '==', userCredential.user.uid)
            );
            
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let user;
                QuerySnapshot.forEach((doc) => user = doc.data());
                
                if (user) {
                    localStorage.setItem("users", JSON.stringify(user));
                    setUserLogin({ email: "", password: "" });
                    toast.success("Login successful!");
                    
                    // Redirect based on user role
                    if (user.role === "user") {
                        navigate('/');
                    } else {
                        navigate('/admin-dashboard');
                    }
                } else {
                    toast.error("User data not found");
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Login error:", error);
            setLoading(false);
            
            // More specific error messages
            if (error.code === 'auth/user-not-found') {
                toast.error("No account found with this email");
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Incorrect password");
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many attempts. Try again later.");
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email format");
            } else {
                toast.error("Login failed. Please try again.");
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4"
        >
            {loading && <Loader />}
            
            <div className="w-full max-w-md">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                        <p className="text-blue-100 mt-2">Sign in to continue your journey</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
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
                                    name="email"
                                    placeholder="your@email.com"
                                    value={userLogin.email}
                                    onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <span className="text-xs text-gray-500">Min. 6 characters</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    value={userLogin.password}
                                    onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="text-gray-500 hover:text-gray-700 transition" />
                                    ) : (
                                        <FaEye className="text-gray-500 hover:text-gray-700 transition" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end mb-6">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition flex items-center"
                            >
                                Forgot password? <FaArrowRight className="ml-1 text-xs" />
                            </button>
                        </div>

                        {/* Login Button */}
                        <div className="mb-6">
                            <motion.button
                                onClick={userLoginFunction}
                                onMouseEnter={() => setIsHoveringLogin(true)}
                                onMouseLeave={() => setIsHoveringLogin(false)}
                                disabled={!isFormValid}
                                whileHover={isFormValid ? { scale: 1.02 } : {}}
                                whileTap={isFormValid ? { scale: 0.98 } : {}}
                                className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-md transition-all duration-300 ${
                                    isFormValid 
                                        ? isHoveringLogin 
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Sign In
                            </motion.button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center mb-6">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-3 text-gray-400 text-sm">or continue with</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Sign-up Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                New to our platform?{" "}
                                <Link 
                                    to="/signup" 
                                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Login;