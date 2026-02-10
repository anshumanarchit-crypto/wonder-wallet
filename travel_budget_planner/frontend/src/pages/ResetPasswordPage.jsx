import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Lock, ArrowRight, CheckCircle, XCircle } from "lucide-react"

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [status, setStatus] = useState("idle") // idle, loading, success, error
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setStatus("error")
            setMessage("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setStatus("error")
            setMessage("Password must be at least 6 characters")
            return
        }

        setStatus("loading")
        setMessage("")

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            })
            const data = await res.json()

            if (res.ok) {
                setStatus("success")
                setMessage(data.message)
            } else {
                setStatus("error")
                setMessage(data.error || "Failed to reset password.")
            }
        } catch (error) {
            setStatus("error")
            setMessage("Something went wrong. Please try again.")
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center">
                    <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
                    <p className="text-muted-foreground mb-6">This password reset link is invalid or missing.</p>
                    <Link to="/auth" className="text-primary hover:underline font-medium">Back to Login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold mb-2">Reset Password 🔐</h1>
                    <p className="text-muted-foreground">Enter your new password below.</p>
                </div>

                {status === "success" ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg p-6 text-center animate-fade-in-up">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Password Reset Successful!</h3>
                        <p className="text-sm mb-6">{message}</p>
                        <Link to="/auth" className="w-full inline-flex justify-center py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all">
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === "error" && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm animate-shake">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-11 pr-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-11 pr-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
                        >
                            {status === "loading" ? "Resetting..." : "Reset Password"}
                            {!status !== "loading" && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
