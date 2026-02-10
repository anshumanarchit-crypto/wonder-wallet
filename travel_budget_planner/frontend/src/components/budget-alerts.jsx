import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, CheckCircle, XCircle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

export function BudgetAlerts() {
    const [alerts] = useState([
        { id: "1", category: "Transport", limit: 10000, current: 7500, percentage: 75 },
        { id: "2", category: "Food", limit: 5000, current: 2000, percentage: 40 },
        { id: "3", category: "Accommodation", limit: 15000, current: 14500, percentage: 96.7 },
    ])

    const getAlertStatus = (percentage) => {
        if (percentage >= 90) return { color: "text-red-500", icon: XCircle, message: "Budget exceeded!" }
        if (percentage >= 75) return { color: "text-orange-500", icon: AlertTriangle, message: "High spending alert" }
        if (percentage >= 50) return { color: "text-yellow-500", icon: Bell, message: "Halfway there" }
        return { color: "text-green-500", icon: CheckCircle, message: "On track" }
    }

    return (
        <Card className="border-2 border-primary/30 shadow-lg animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20">
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Budget Alerts & Limits
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                {alerts.map((alert) => {
                    const status = getAlertStatus(alert.percentage)
                    const Icon = status.icon

                    return (
                        <div key={alert.id} className="bg-muted/30 p-4 rounded-lg border border-border space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className={`w-5 h-5 ${status.color}`} />
                                    <h4 className="font-semibold">{alert.category}</h4>
                                </div>
                                <span className={`text-sm font-medium ${status.color}`}>{status.message}</span>
                            </div>

                            <Progress value={alert.percentage} className="h-2" />

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Spent: ₹{alert.current.toLocaleString()} / ₹{alert.limit.toLocaleString()}
                                </span>
                                <span className={`font-bold ${status.color}`}>{alert.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    )
                })}

                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    <Bell className="w-4 h-4 mr-2" />
                    Set New Alert
                </Button>
            </CardContent>
        </Card>
    )
}
