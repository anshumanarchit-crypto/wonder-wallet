import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DESTINATIONS = [
    { id: "tokyo", name: "🗼 Tokyo, Japan", budgetTier: "Luxury", estimatedCost: 705500, attractions: 15, avgMealCost: 2075, hotelCost: 14940, highlights: ["Modern tech culture", "Traditional temples", "World-class cuisine"], image: "/tokyo-japan-neon-lights-modern-city.jpg" },
    { id: "bali", name: "🏝️ Bali, Indonesia", budgetTier: "Standard", estimatedCost: 232400, attractions: 25, avgMealCost: 415, hotelCost: 2905, highlights: ["Tropical beaches", "Ancient temples", "Budget-friendly"], image: "/bali-indonesia-tropical-beach-sunset.jpg" },
    { id: "paris", name: "🗽 Paris, France", budgetTier: "Luxury", estimatedCost: 597600, attractions: 20, avgMealCost: 2490, hotelCost: 12450, highlights: ["Art & culture", "Fine dining", "Romantic atmosphere"], image: "/paris-france-eiffel-tower-romantic.jpg" },
    { id: "bangkok", name: "🏙️ Bangkok, Thailand", budgetTier: "Budget", estimatedCost: 161850, attractions: 30, avgMealCost: 249, hotelCost: 1660, highlights: ["Street food paradise", "Grand Palace", "Vibrant markets"], image: "/bangkok-thailand-street-food-night-market.jpg" },
    { id: "newyork", name: "🗽 New York, USA", budgetTier: "Luxury", estimatedCost: 539500, attractions: 40, avgMealCost: 2324, hotelCost: 16600, highlights: ["Broadway shows", "World-class museums", "Iconic landmarks"], image: "/new-york-city-skyline-times-square.jpg" },
    { id: "buenosaires", name: "💃 Buenos Aires, Argentina", budgetTier: "Standard", estimatedCost: 265600, attractions: 22, avgMealCost: 996, hotelCost: 4980, highlights: ["Tango culture", "European architecture", "Great value"], image: "/buenos-aires-argentina-tango-culture-historic.jpg" },
]

export function DestinationComparison() {
    const [selectedDestinations, setSelectedDestinations] = useState(["tokyo", "bali"])

    const toggleDestination = (id) => {
        setSelectedDestinations((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
    }

    const selected = DESTINATIONS.filter((d) => selectedDestinations.includes(d.id))
    const totalCost = selected.reduce((sum, d) => sum + d.estimatedCost, 0)

    return (
        <section id="destinations" className="py-20 md:py-32 bg-gradient-to-br from-accent/5 via-background to-secondary/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Compare Destinations</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore and compare costs, attractions, and experiences across popular destinations
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {DESTINATIONS.map((destination) => (
                        <Card
                            key={destination.id}
                            className={`bg-white border-2 cursor-pointer transition-all overflow-hidden hover:shadow-xl ${selectedDestinations.includes(destination.id)
                                    ? "border-primary shadow-lg scale-105"
                                    : "border-secondary/20 hover:border-primary/50"
                                }`}
                            onClick={() => toggleDestination(destination.id)}
                        >
                            <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                                <img src={destination.image || "/placeholder.svg"} alt={destination.name} className="w-full h-full object-cover" />
                                <input type="checkbox" checked={selectedDestinations.includes(destination.id)} onChange={() => { }} className="absolute top-3 right-3 cursor-pointer w-5 h-5 rounded" />
                            </div>

                            <CardHeader className="pb-3">
                                <CardTitle className="text-foreground text-lg">{destination.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Estimated Cost</span>
                                        <span className="font-bold text-primary text-lg">₹{destination.estimatedCost.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Budget Tier</span>
                                        <span className="font-semibold text-foreground">{destination.budgetTier}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Avg Meal</span>
                                        <span className="font-semibold text-foreground">₹{destination.avgMealCost.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Hotel/Night</span>
                                        <span className="font-semibold text-foreground">₹{destination.hotelCost.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Attractions</span>
                                        <span className="font-semibold text-foreground">{destination.attractions}+</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-secondary/20">
                                    <div className="text-xs font-semibold text-foreground mb-3">Highlights:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {destination.highlights.map((highlight) => (
                                            <span key={highlight} className="text-xs bg-primary/15 text-primary px-2.5 py-1.5 rounded-full font-medium">
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {selected.length > 0 && (
                    <Card className="bg-gradient-to-br from-white to-primary/5 border-primary/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-foreground text-2xl">Comparison Summary</CardTitle>
                            <CardDescription>Cost analysis for your selected destinations in INR</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    {selected.map((destination) => (
                                        <div key={destination.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/15 to-secondary/5 rounded-lg border border-secondary/20">
                                            <span className="font-semibold text-foreground">{destination.name}</span>
                                            <span className="text-lg font-bold text-primary">₹{destination.estimatedCost.toLocaleString("en-IN")}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="space-y-3 p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                                        <div className="text-sm font-semibold text-muted-foreground">Total Estimated Cost</div>
                                        <div className="text-5xl font-bold text-primary">₹{totalCost.toLocaleString("en-IN")}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Average per destination: ₹{Math.round(totalCost / selected.length).toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-6 py-6 text-base">
                                        Create Trip Plan
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    )
}
