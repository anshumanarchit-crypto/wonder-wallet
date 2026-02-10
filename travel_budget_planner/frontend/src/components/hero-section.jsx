import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function HeroSection() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const handlePlanClick = () => {
        if (user) {
            navigate("/dashboard")
        } else {
            navigate("/auth")
        }
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/15 py-24 md:py-48">
            <div className="absolute inset-0 opacity-3">
                <svg className="w-full h-full" viewBox="0 0 1200 600">
                    <defs>
                        <pattern id="wanderwallet-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                            <text x="50" y="100" fontSize="40" fill="currentColor">✈️</text>
                            <text x="150" y="50" fontSize="40" fill="currentColor">🏔️</text>
                            <text x="100" y="150" fontSize="40" fill="currentColor">🏖️</text>
                            <text x="30" y="180" fontSize="40" fill="currentColor">🚂</text>
                        </pattern>
                    </defs>
                    <rect width="1200" height="600" fill="url(#wanderwallet-pattern)" />
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">
                <div className="text-center space-y-8">
                    <div className="inline-block bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground px-6 py-3 rounded-full text-sm font-bold border border-primary/40 shadow-lg">
                        Welcome to WanderWallet 🧳
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
                        Your Smart Travel <span className="text-primary">Budget Companion</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                        Plan your dream trips across India and the world with intelligent budget recommendations. From ₹2,000
                        weekend getaways to luxury international adventures - all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Button size="lg" onClick={handlePlanClick} className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all">
                            {user ? "Go to Dashboard" : "Plan Your Trip Now"}
                        </Button>
                        <Button size="lg" variant="outline" onClick={handlePlanClick} className="border-primary/40 text-primary hover:bg-primary/5 bg-white font-semibold px-8 py-6 text-base">
                            Explore Destinations
                        </Button>
                    </div>

                    <div className="pt-12 grid grid-cols-3 gap-4 md:gap-8">
                        <div className="p-4 md:p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-primary/20 shadow-sm hover:shadow-md transition-all">
                            <div className="text-3xl md:text-4xl font-bold text-primary">100+</div>
                            <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Destinations</p>
                        </div>
                        <div className="p-4 md:p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary/20 shadow-sm hover:shadow-md transition-all">
                            <div className="text-3xl md:text-4xl font-bold text-secondary">∞</div>
                            <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Budget Tiers</p>
                        </div>
                        <div className="p-4 md:p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-accent/20 shadow-sm hover:shadow-md transition-all">
                            <div className="text-3xl md:text-4xl font-bold text-accent">24/7</div>
                            <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Smart Planning</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
