import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"

const EXPENSE_DATA = [
    { name: "Week 1", flights: 66400, accommodation: 49800, food: 24900, activities: 12450, misc: 4150 },
    { name: "Week 2", flights: 0, accommodation: 49800, food: 29050, activities: 16600, misc: 6640 },
    { name: "Week 3", flights: 74700, accommodation: 53900, food: 26580, activities: 14940, misc: 5810 },
]

const PIE_DATA = [
    { name: "Flights", value: 141100, fill: "var(--color-primary)" },
    { name: "Accommodation", value: 153550, fill: "var(--color-secondary)" },
    { name: "Food", value: 80510, fill: "var(--color-accent)" },
    { name: "Activities", value: 43990, fill: "var(--color-chart-4)" },
    { name: "Miscellaneous", value: 16600, fill: "var(--color-chart-5)" },
]

export function Dashboard() {
    return (
        <section id="dashboard" className="py-20 md:py-32 bg-gradient-to-br from-secondary/5 via-background to-accent/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Interactive Dashboard</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Visualize your expenses and track spending patterns with detailed insights
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-foreground text-sm font-semibold">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary">₹4,35,750</div>
                            <p className="text-xs text-muted-foreground mt-3">75% of ₹5,81,000 budget</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-foreground text-sm font-semibold">Remaining Budget</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-accent">₹1,45,250</div>
                            <p className="text-xs text-muted-foreground mt-3">25% left for 2 more days</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-foreground text-sm font-semibold">Daily Average</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-secondary">₹72,625</div>
                            <p className="text-xs text-muted-foreground mt-3">Across all categories</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="bg-white shadow-lg border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-foreground text-xl">Weekly Spending Trend</CardTitle>
                            <CardDescription>Expenses by category over time in INR</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={EXPENSE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                    <Legend />
                                    <Bar dataKey="flights" stackId="a" fill="var(--color-primary)" name="Flights" />
                                    <Bar dataKey="accommodation" stackId="a" fill="var(--color-secondary)" name="Accommodation" />
                                    <Bar dataKey="food" stackId="a" fill="var(--color-accent)" name="Food" />
                                    <Bar dataKey="activities" stackId="a" fill="var(--color-chart-4)" name="Activities" />
                                    <Bar dataKey="misc" stackId="a" fill="var(--color-chart-5)" name="Misc" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-accent/10">
                        <CardHeader>
                            <CardTitle className="text-foreground text-xl">Budget Distribution</CardTitle>
                            <CardDescription>Current allocation by category in INR</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={PIE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {PIE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
