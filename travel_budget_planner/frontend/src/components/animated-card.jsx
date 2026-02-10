import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnimatedCard({ title, icon, value, color, delay = 0 }) {
    const colorMap = {
        primary: "from-primary/20 to-primary/10",
        secondary: "from-secondary/20 to-secondary/10",
        accent: "from-accent/20 to-accent/10",
    }

    return (
        <div
            style={{
                animation: `fadeInUp 0.6s ease-out ${delay * 0.1}s both`,
            }}
            className="card-hover"
        >
            <Card
                className={`bg-gradient-to-br ${colorMap[color]} border-2 h-full hover:shadow-xl transition-all`}
            >
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <span className="text-4xl animate-float">{icon}</span>
                        <span className="text-lg">{title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{value}</div>
                </CardContent>
            </Card>
        </div>
    )
}
