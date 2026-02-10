import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState("idle") // idle, loading, success, error
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus("loading")
        setMessage("")

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()

            if (res.ok) {
                setStatus("success")
                setMessage(data.message)
            } else {
                setStatus("error")
                setMessage(data.error || "Failed to send reset link.")
            }
        } catch (error) {
            setStatus("error")
            setMessage("Something went wrong. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8">
                <div className="mb-6">
                    <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Forgot Password? 🔒</h1>
                    <p className="text-muted-foreground">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                {status === "success" ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg p-6 text-center animate-fade-in-up">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Check your email</h3>
                        <p className="text-sm mb-4">{message}</p>
                        <p className="text-xs text-muted-foreground">Did not receive the email? Check your spam folder.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === "error" && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm animate-shake">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
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
                            {status === "loading" ? "Sending..." : "Send Reset Link"}
                            {!status !== "loading" && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
