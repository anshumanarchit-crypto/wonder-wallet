import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const TIERS = [
    {
        id: "budget", name: "Budget", icon: "🎒", color: "bg-yellow-100 text-yellow-800",
        description: "Perfect for backpackers and budget-conscious travelers", totalBudget: 166000,
        breakdown: [
            { category: "Flights", amount: 58100, percentage: 35 },
            { category: "Accommodation", amount: 49800, percentage: 30 },
            { category: "Food & Dining", amount: 33200, percentage: 20 },
            { category: "Activities", amount: 16600, percentage: 10 },
            { category: "Miscellaneous", amount: 8300, percentage: 5 },
        ],
        features: ["Hostels & budget hotels", "Street food & local eateries", "Free activities", "Public transport"],
    },
    {
        id: "standard", name: "Standard", icon: "✈️", color: "bg-blue-100 text-blue-800",
        description: "Balanced comfort and experience for typical travelers", totalBudget: 415000,
        breakdown: [
            { category: "Flights", amount: 145250, percentage: 35 },
            { category: "Accommodation", amount: 124500, percentage: 30 },
            { category: "Food & Dining", amount: 83000, percentage: 20 },
            { category: "Activities", amount: 41500, percentage: 10 },
            { category: "Miscellaneous", amount: 20750, percentage: 5 },
        ],
        features: ["3-4 star hotels", "Mix of restaurants", "Paid tours", "Taxis & rentals"],
    },
    {
        id: "luxury", name: "Luxury", icon: "👑", color: "bg-purple-100 text-purple-800",
        description: "Premium experience with comfort and exclusivity", totalBudget: 830000,
        breakdown: [
            { category: "Flights", amount: 290500, percentage: 35 },
            { category: "Accommodation", amount: 249000, percentage: 30 },
            { category: "Food & Dining", amount: 166000, percentage: 20 },
            { category: "Activities", amount: 83000, percentage: 10 },
            { category: "Miscellaneous", amount: 41500, percentage: 5 },
        ],
        features: ["5-star hotels", "Fine dining", "VIP tours", "Private transport"],
    },
]

export function RecommendationsSection() {
    return (
        <section id="recommendations" className="py-20 md:py-32 bg-gradient-to-br from-background to-primary/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Personalized Recommendations</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose a budget tier that fits your travel style and explore what's included
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TIERS.map((tier) => (
                        <Card key={tier.id} className="bg-gradient-to-br from-white to-background border-secondary/10 hover:shadow-xl hover:border-primary/30 transition-all h-full flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-5xl">{tier.icon}</div>
                                    <Badge className={`${tier.color} px-3 py-1 text-xs font-semibold`}>{tier.name}</Badge>
                                </div>
                                <CardTitle className="text-foreground text-3xl font-bold">
                                    ₹{(tier.totalBudget / 100000).toFixed(1)}L
                                </CardTitle>
                                <CardDescription className="text-base mt-2">{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-6">
                                <div className="space-y-3 bg-background/50 p-4 rounded-lg">
                                    {tier.breakdown.map((item) => (
                                        <div key={item.category} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{item.category}</span>
                                            <div className="text-right">
                                                <span className="font-semibold text-foreground">₹{item.amount.toLocaleString("en-IN")}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-secondary/20 pt-4 flex-1">
                                    <div className="text-sm font-semibold text-foreground mb-4">What's Included:</div>
                                    <ul className="space-y-3">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="text-sm text-muted-foreground flex items-center gap-3">
                                                <span className="text-primary text-lg">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4">
                                    Select {tier.name}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
