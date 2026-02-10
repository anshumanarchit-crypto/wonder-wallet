import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Smartphone, CheckCircle } from "lucide-react"

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login, register, googleLogin, resetPassword } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccessMsg("")
        setLoading(true)

        try {
            if (isLogin) {
                await login(email, password)
                navigate("/dashboard")
            } else {
                if (!name.trim()) { setError("Name is required"); setLoading(false); return }
                if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return }

                await register(name, email, password, mobile) // Pass mobile here
                setSuccessMsg("Account created! Please check your email to verify your account before logging in.")
                setIsLogin(true)
            }
        } catch (err) {
            console.error(err)
            // Firebase error mapping
            if (err.code === 'auth/email-already-in-use') setError("Email already in use");
            else if (err.code === 'auth/wrong-password') setError("Invalid password");
            else if (err.code === 'auth/user-not-found') setError("No account found with this email");
            else setError(err.message || "Authentication failed");
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError("")
        setLoading(true)
        try {
            await googleLogin()
            navigate("/dashboard")
        } catch (err) {
            setError("Google sign-in failed. " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first to reset password.")
            return
        }
        try {
            await resetPassword(email)
            setSuccessMsg("Password reset email sent! Check your inbox.")
        } catch (err) {
            setError("Failed to send reset email: " + err.message)
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setError("")
        setSuccessMsg("")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                        {isLogin ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="text-muted-foreground">
                        {isLogin ? "Sign in to continue" : "Start planning your trip"}
                    </p>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors mb-6"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg px-4 py-3 mb-6 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mobile</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                                    <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background" />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2 border rounded-lg bg-background" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {isLogin && (
                            <div className="flex justify-end mt-1">
                                <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                        {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={toggleMode} className="text-primary hover:underline text-sm font-medium">
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    )
}
