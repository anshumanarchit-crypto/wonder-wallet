import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingDown, MapPin, Calendar } from 'lucide-react'

export function CostSavingTips() {
    const tips = [
        {
            icon: Calendar,
            title: "Book 2-3 months in advance",
            description: "Flight and hotel prices can be 30-40% cheaper when booked early",
            savings: "Save up to ₹15,000",
            color: "text-blue-500",
        },
        {
            icon: MapPin,
            title: "Travel during off-season",
            description: "Visit Goa in monsoon or Himachal in summer for 50% lower rates",
            savings: "Save ₹8,000-20,000",
            color: "text-green-500",
        },
        {
            icon: TrendingDown,
            title: "Use local transport",
            description: "Public buses and trains are 70% cheaper than taxis for city travel",
            savings: "Save ₹5,000 per week",
            color: "text-orange-500",
        },
        {
            icon: Lightbulb,
            title: "Eat at local restaurants",
            description: "Street food and local eateries offer authentic food at half the price",
            savings: "Save ₹3,000-6,000",
            color: "text-purple-500",
        },
    ]

    return (
        <Card className="border-2 border-primary/30 shadow-lg animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20">
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI-Powered Cost-Saving Tips
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                    {tips.map((tip, index) => {
                        const Icon = tip.icon
                        return (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-muted/50 to-background p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all card-hover"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 bg-background rounded-lg ${tip.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                                        <p className="text-sm font-bold text-primary">{tip.savings}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
