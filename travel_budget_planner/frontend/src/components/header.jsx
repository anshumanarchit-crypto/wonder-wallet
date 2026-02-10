import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const isDashboard = location.pathname.startsWith("/dashboard")

    const scrollToSection = (sectionId) => {
        setIsMobileMenuOpen(false)
        if (!isDashboard) {
            navigate("/dashboard")
            // After navigation, the dashboard page will mount, but scrolling might be tricky 
            // without a delay or context state. For now, just navigating to dashboard is a good start.
            // A better approach for the future would be passing state to dashboard to trigger scroll.
        } else {
            const el = document.getElementById(sectionId)
            el?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleLogout = () => {
        logout()
        setIsMobileMenuOpen(false)
        navigate("/")
    }

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                        🧳
                    </div>
                    <span className="font-bold text-foreground text-xl">WanderWallet</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Dashboard</Link>
                            <Link to="/dashboard/chat" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">AI Trip Planner</Link>
                            <button onClick={() => scrollToSection("travel-mode")} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">Planner</button>
                            <button onClick={() => scrollToSection("destinations")} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium bg-transparent border-none cursor-pointer">Destinations</button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Home</Link>
                            <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Login</Link>
                        </>
                    )}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard/chat">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9 px-4">
                                    🤖 AI Trip Planner
                                </Button>
                            </Link>
                            <div className="w-px h-6 bg-border mx-1" />
                            <div className="flex items-center gap-2 pl-1">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-primary/30" />
                                ) : (
                                    <UserCircle className="w-8 h-8 text-primary" />
                                )}
                                <span className="text-sm font-medium text-foreground hidden xl:inline">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-transparent border-none cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth">
                            <Button className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>

                <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-background border-t border-border py-4 px-4 space-y-3">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-muted-foreground hover:text-primary">Dashboard</Link>
                            <Link to="/dashboard/chat" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-muted-foreground hover:text-primary">AI Trip Planner</Link>
                            <button onClick={() => scrollToSection("travel-mode")} className="block py-2 text-muted-foreground hover:text-primary w-full text-left bg-transparent border-none cursor-pointer">Planner</button>
                            <button onClick={() => scrollToSection("destinations")} className="block py-2 text-muted-foreground hover:text-primary w-full text-left bg-transparent border-none cursor-pointer">Destinations</button>

                            <div className="flex items-center gap-2 py-2 border-t border-border pt-4">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-primary/30" />
                                ) : (
                                    <UserCircle className="w-8 h-8 text-primary" />
                                )}
                                <span className="text-sm font-medium text-foreground">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-2 text-left text-destructive hover:text-destructive/80 flex items-center gap-2 bg-transparent border-none cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-muted-foreground hover:text-primary">Home</Link>
                            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full mt-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}
