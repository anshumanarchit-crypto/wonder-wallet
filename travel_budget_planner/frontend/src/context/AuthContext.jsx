import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get ID token to send to backend
                const token = await firebaseUser.getIdToken();

                // Sync with backend (optional, if you need MongoDB data)
                try {
                    const res = await fetch('/api/auth/sync', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            mobile: '' // We don't have mobile here unless we store it in local state during signup
                        })
                    });
                    const data = await res.json();

                    setUser({
                        ...data.user, // MongoDB user data
                        uid: firebaseUser.uid,
                        emailVerified: firebaseUser.emailVerified
                    });
                } catch (error) {
                    console.error("Failed to sync user with backend:", error);
                    // Fallback to minimal firebase user
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                        avatar: firebaseUser.photoURL,
                        emailVerified: firebaseUser.emailVerified
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (name, email, password, mobile) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await sendEmailVerification(result.user);

        // Sync immediately to save mobile number and name
        const token = await result.user.getIdToken();
        await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mobile })
        });

        return result;
    };

    const googleLogin = async () => {
        // Sign in with Google
        const result = await signInWithPopup(auth, googleProvider);
        // Backend sync happens in onAuthStateChanged
        return result;
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
