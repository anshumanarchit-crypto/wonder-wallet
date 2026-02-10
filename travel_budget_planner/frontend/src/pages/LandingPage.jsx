import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-grow">
                <HeroSection />

                {/* Features Preview Section */}
                <section className="py-20 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need for the perfect trip</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                            Join thousands of travelers who plan smarter, budget better, and explore more.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Smart Budgeting", desc: "Track every expense and stay within your limits with real-time alerts.", icon: "💰" },
                                { title: "AI Itineraries", desc: "Get personalized day-by-day plans tailored to your preferences.", icon: "🤖" },
                                { title: "Destination Discovery", desc: "Compare destinations specifically based on your budget.", icon: "🌍" }
                            ].map((feature, i) => (
                                <div key={i} className="p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-all">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16">
                            <Link to="/auth">
                                <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                                    Start Planning for Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
