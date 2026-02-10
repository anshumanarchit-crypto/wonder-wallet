import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const INTERNATIONAL_EXPENSE_CATEGORIES = [
    { id: "flights", label: "International Flights", icon: "✈️", percentage: 0.35 },
    { id: "accommodation", label: "Accommodation", icon: "🏨", percentage: 0.3 },
    { id: "food", label: "Food & Dining", icon: "🍽️", percentage: 0.2 },
    { id: "activities", label: "Activities & Tours", icon: "🎯", percentage: 0.1 },
    { id: "miscellaneous", label: "Visa, Insurance & Misc", icon: "📋", percentage: 0.05 },
]

export function BudgetCalculatorInternational() {
    const [totalBudget, setTotalBudget] = useState(300000)
    const [tripDays, setTripDays] = useState(7)

    const budgetByCategory = INTERNATIONAL_EXPENSE_CATEGORIES.map((category) => ({
        ...category,
        amount: Math.round(totalBudget * category.percentage),
    }))

    const dailyBudget = Math.round(totalBudget / tripDays)

    return (
        <section id="calculator" className="py-20 md:py-32 bg-gradient-to-br from-background via-secondary/5 to-background">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Plan Your Global Adventure</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get intelligent budget breakdown for your international trip</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <Card className="bg-gradient-to-br from-white to-secondary/5 border-secondary/20 shadow-lg">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-foreground text-2xl">Trip Details</CardTitle>
                            <CardDescription className="text-base">Customize your international trip budget</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-4 block flex justify-between">
                                    <span>Total Budget</span>
                                    <span className="text-secondary text-lg">₹ {totalBudget.toLocaleString("en-IN")}</span>
                                </label>
                                <Input type="range" min="50000" max="1250000" step="10000" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} className="w-full h-2" />
                                <div className="text-xs text-muted-foreground mt-3 flex justify-between">
                                    <span>₹50,000</span>
                                    <span>₹12,50,000</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-foreground mb-4 block flex justify-between">
                                    <span>Trip Duration</span>
                                    <span className="text-secondary text-lg">{tripDays} days</span>
                                </label>
                                <Input type="range" min="3" max="30" value={tripDays} onChange={(e) => setTripDays(Number(e.target.value))} className="w-full h-2" />
                                <div className="text-xs text-muted-foreground mt-3 flex justify-between">
                                    <span>3 days</span>
                                    <span>30 days</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-secondary/15 to-secondary/5 p-6 rounded-xl border border-secondary/30 mt-8">
                                <div className="text-sm text-muted-foreground mb-2 font-semibold">Daily Budget</div>
                                <div className="text-4xl font-bold text-secondary">₹ {dailyBudget.toLocaleString("en-IN")}</div>
                                <div className="text-sm text-muted-foreground mt-3">
                                    Total: ₹ {totalBudget.toLocaleString("en-IN")} / {tripDays} days
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {budgetByCategory.map((category) => (
                            <Card key={category.id} className="bg-gradient-to-r from-white to-background hover:shadow-md transition-all border-secondary/10">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{category.icon}</span>
                                            <div>
                                                <div className="font-semibold text-foreground text-lg">{category.label}</div>
                                                <div className="text-xs text-muted-foreground">{(category.percentage * 100).toFixed(0)}% of budget</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-secondary">₹ {category.amount.toLocaleString("en-IN")}</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                        <div className="bg-gradient-to-r from-secondary to-secondary/60 h-3 rounded-full transition-all duration-300" style={{ width: `${category.percentage * 100}%` }} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
