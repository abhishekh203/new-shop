import { useState, useCallback } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider 
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { auth, fireDB } from '../firebase/FirebaseConfig';
import { handleAuthError } from '../utils/errorHandler';
import { RateLimiter } from '../utils/validation';
import toast from 'react-hot-toast';

// Initialize rate limiter
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts, 15 min lockout

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Login function with rate limiting
    const login = useCallback(async (email, password) => {
        if (!rateLimiter.isAllowed(email)) {
            const remainingTime = rateLimiter.getLockoutTimeRemaining(email);
            const minutes = Math.ceil(remainingTime / 60000);
            toast.error(`Too many login attempts. Try again in ${minutes} minutes.`);
            return { success: false, error: 'rate_limited' };
        }

        setLoading(true);
        setProgress(25);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setProgress(50);

            // Fetch user data from Firestore
            const q = query(collection(fireDB, "user"), where('uid', '==', userCredential.user.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast.error("User data not found. Please contact support.");
                await auth.signOut();
                return { success: false, error: 'user_data_not_found' };
            }

            let userData;
            querySnapshot.forEach((doc) => userData = doc.data());
            
            setProgress(75);
            
            // Store user data
            localStorage.setItem("users", JSON.stringify(userData));
            
            setProgress(100);
            toast.success("Login successful! Redirecting...");

            return { 
                success: true, 
                user: userData,
                redirectTo: userData.role === "admin" ? '/admin-dashboard' : '/'
            };

        } catch (error) {
            console.error("Login error:", error);
            rateLimiter.recordAttempt(email);
            
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
            
            return { success: false, error: error.code, message: errorMessage };
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }, []);

    // Signup function
    const signup = useCallback(async (userData) => {
        setLoading(true);
        setProgress(25);

        try {
            // Check if email already exists
            const q = query(collection(fireDB, "user"), where("email", "==", userData.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                toast.error("This email address is already registered.");
                return { success: false, error: 'email_exists' };
            }

            setProgress(50);

            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const firebaseUser = userCredential.user;

            setProgress(75);

            // Save user data to Firestore
            const userDoc = {
                name: userData.name.trim(),
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                role: userData.role || "user",
                time: Timestamp.now(),
                date: new Date().toISOString(),
                emailVerified: firebaseUser.emailVerified || false,
            };

            const userRef = doc(fireDB, "user", firebaseUser.uid);
            await setDoc(userRef, userDoc);

            setProgress(100);
            toast.success("Account created successfully! Redirecting to login...");

            return { success: true };

        } catch (error) {
            console.error("Signup error:", error);
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
            
            return { success: false, error: error.code, message: errorMessage };
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }, []);

    // Password reset function
    const resetPassword = useCallback(async (email) => {
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent! Check your inbox (and spam folder).");
            return { success: true };
        } catch (error) {
            console.error("Password reset error:", error);
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
            return { success: false, error: error.code, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    // Check remaining login attempts
    const getRemainingAttempts = useCallback((email) => {
        return rateLimiter.getRemainingAttempts(email);
    }, []);

    // Google signup function
    const signupWithGoogle = useCallback(async () => {
        setLoading(true);
        setProgress(25);

        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            setProgress(50);

            // Check if user already exists in Firestore
            const userRef = doc(fireDB, "user", firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                // User already exists, treat as login
                const userData = userDoc.data();
                localStorage.setItem("users", JSON.stringify(userData));
                setProgress(100);
                toast.success("Welcome back! Logged in successfully.");
                
                return { 
                    success: true, 
                    user: userData,
                    redirectTo: userData.role === "admin" ? '/admin-dashboard' : '/'
                };
            } else {
                // New user, create account
                setProgress(75);

                const userDocData = {
                    name: firebaseUser.displayName || 'Google User',
                    email: firebaseUser.email,
                    uid: firebaseUser.uid,
                    role: "user",
                    time: Timestamp.now(),
                    date: new Date().toISOString(),
                    emailVerified: firebaseUser.emailVerified || false,
                    photoURL: firebaseUser.photoURL || null,
                    provider: 'google'
                };

                await setDoc(userRef, userDocData);
                localStorage.setItem("users", JSON.stringify(userDocData));

                setProgress(100);
                toast.success("Account created successfully with Google!");

                return { 
                    success: true, 
                    user: userDocData,
                    redirectTo: '/'
                };
            }

        } catch (error) {
            console.error("Google signup error:", error);
            
            let errorMessage = "Google signup failed. Please try again.";
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Signup cancelled. Please try again.";
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = "Popup blocked. Please allow popups and try again.";
            } else if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = "Another signup attempt is in progress.";
            }
            
            toast.error(errorMessage);
            
            return { success: false, error: error.code, message: errorMessage };
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }, []);

    // Check if user is locked out
    const isLockedOut = useCallback((email) => {
        return !rateLimiter.isAllowed(email);
    }, []);

    return {
        loading,
        progress,
        login,
        signup,
        signupWithGoogle,
        resetPassword,
        getRemainingAttempts,
        isLockedOut
    };
}; 