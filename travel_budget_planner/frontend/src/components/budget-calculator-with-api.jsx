import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { fetchBudgetBreakdown } from "@/lib/api-client"

const EXPENSE_CATEGORIES = [
    { id: "flights", label: "Flights", icon: "✈️" },
    { id: "accommodation", label: "Accommodation", icon: "🏨" },
    { id: "food", label: "Food & Dining", icon: "🍽️" },
    { id: "activities", label: "Activities", icon: "🎯" },
    { id: "miscellaneous", label: "Miscellaneous", icon: "🎒" },
]

export function BudgetCalculatorWithAPI() {
    const [totalBudget, setTotalBudget] = useState(3000)
    const [tripDays, setTripDays] = useState(7)
    const [breakdown, setBreakdown] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadBreakdown = async () => {
            setLoading(true)
            try {
                const result = await fetchBudgetBreakdown(totalBudget, tripDays)
                setBreakdown(result.data.breakdown)
            } catch (error) {
                console.error("Failed to load budget breakdown:", error)
            } finally {
                setLoading(false)
            }
        }

        loadBreakdown()
    }, [totalBudget, tripDays])

    const dailyBudget = Math.round(totalBudget / tripDays)

    return (
        <section id="calculator" className="py-16 md:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Budget Calculator</h2>
                    <p className="text-muted-foreground text-lg">
                        Get AI-powered real-time suggestions for each expense category
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Trip Details</CardTitle>
                            <CardDescription>Enter your budget and trip duration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Total Budget: ${totalBudget}</label>
                                <Input
                                    type="range"
                                    min="500"
                                    max="15000"
                                    value={totalBudget}
                                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-xs text-muted-foreground mt-2">$500 - $15,000</div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Trip Duration: {tripDays} days</label>
                                <Input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={tripDays}
                                    onChange={(e) => setTripDays(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-xs text-muted-foreground mt-2">1 - 30 days</div>
                            </div>

                            <div className="bg-secondary/30 p-4 rounded-lg border border-secondary">
                                <div className="text-sm text-muted-foreground mb-1">Daily Budget</div>
                                <div className="text-3xl font-bold text-primary">${dailyBudget}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {loading ? (
                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="text-center text-muted-foreground">Loading breakdown...</div>
                                </CardContent>
                            </Card>
                        ) : breakdown ? (
                            EXPENSE_CATEGORIES.map((category) => {
                                const amount = breakdown[category.id]
                                const percentage = (amount / totalBudget) * 100

                                return (
                                    <Card key={category.id} className="bg-card border-border">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{category.icon}</span>
                                                    <div>
                                                        <div className="font-medium text-foreground">{category.label}</div>
                                                        <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}% of budget</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-primary">${amount}</div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    )
}
