import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Send, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    const navigate = useNavigate()

    const handleSubscribe = (e) => {
        e.preventDefault()
        // Mock subscription
        alert("Thanks for subscribing!")
    }

    return (
        <footer className="bg-background border-t border-border pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                                🧳
                            </div>
                            <span className="font-bold text-foreground text-2xl tracking-tight">WanderWallet</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                            Your intelligent travel companion for planning, budgeting, and exploring the world without breaking the bank.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-primary hover:text-primary-foreground transition-all transform hover:-translate-y-1 shadow-sm"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-foreground text-lg mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Features</Link></li>
                            <li><Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">AI Trip Planner</Link></li>
                            <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Dashboard</Link></li>
                            <li><Link to="#" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">Destinations</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-foreground text-lg mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>123 Travel Street, Adventure City, India</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="mailto:hello@wanderwallet.com" className="hover:text-primary transition-colors">hello@wanderwallet.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="tel:+918789075441" className="hover:text-primary transition-colors">+91 87890 75441</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-foreground text-lg mb-6">Stay Updated</h4>
                        <p className="text-muted-foreground mb-4">
                            Subscribe to get the latest travel tips and budget hacks.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-4 pr-12 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 bottom-1 w-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground/80">
                                No spam, unsubscribe anytime.
                            </p>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} WanderWallet. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm font-medium">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
