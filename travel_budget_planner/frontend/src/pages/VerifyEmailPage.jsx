import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")
    const [status, setStatus] = useState("verifying") // verifying, success, error
    const [message, setMessage] = useState("Verifying your email...")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Invalid verification link.")
            return
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                })
                const data = await res.json()

                if (res.ok) {
                    setStatus("success")
                    setMessage(data.message)
                } else {
                    setStatus("error")
                    setMessage(data.error || "Verification failed.")
                }
            } catch (error) {
                setStatus("error")
                setMessage("Something went wrong. Please try again.")
            }
        }

        verifyEmail()
    }, [token])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    {status === "verifying" && (
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {status === "success" && (
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                    )}
                    {status === "error" && (
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    {status === "verifying" && "Verifying Email"}
                    {status === "success" && "Email Verified!"}
                    {status === "error" && "Verification Failed"}
                </h1>

                <p className="text-muted-foreground mb-8">{message}</p>

                {status === "success" && (
                    <Link to="/auth">
                        <Button className="w-full gap-2">
                            Go to Login <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                )}

                {status === "error" && (
                    <Link to="/auth">
                        <Button variant="outline" className="w-full">
                            Back to Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}
