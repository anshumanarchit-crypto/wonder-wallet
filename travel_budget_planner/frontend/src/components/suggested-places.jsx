import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SuggestedPlaces({ destination, budget, days }) {
    const [attractions, setAttractions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState("all")

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `/api/attractions?destination=${encodeURIComponent(destination)}&budget=${budget}&days=${days}`,
                )

                if (!response.ok) {
                    throw new Error("Failed to fetch attractions")
                }

                const data = await response.json()
                setAttractions(data.attractions)
                setError(null)
            } catch (err) {
                setError("Unable to load attractions")
                setAttractions([])
            } finally {
                setLoading(false)
            }
        }

        fetchAttractions()
    }, [destination, budget, days])

    const categories = ["all", ...new Set(attractions.map((a) => a.category))]

    const filteredAttractions =
        selectedCategory === "all" ? attractions : attractions.filter((a) => a.category === selectedCategory)

    const activitiesBudget = Math.round(budget * 0.1)
    const totalAttractionCost = attractions.reduce((sum, a) => sum + a.entryFee, 0)
    const recommendedAttractions = Math.floor((activitiesBudget / attractions[0]?.entryFee) * days) || 3

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-primary"></div>
                <p className="mt-4 text-muted-foreground">Discovering amazing places in {destination}...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        )
    }

    return (
        <div className="animate-fade-in-up">
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-6">
                    Explore {destination}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Discover {attractions.length} amazing places to visit. Budget available for activities: ₹
                    {activitiesBudget.toLocaleString("en-IN")} ({recommendedAttractions} attractions recommended)
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full font-semibold transition-all ${selectedCategory === category
                                    ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg scale-105"
                                    : "bg-accent/10 text-accent border-2 border-accent/20 hover:border-accent/50"
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction, idx) => (
                    <div
                        key={attraction.id}
                        style={{
                            animation: `slideInUp 0.6s ease-out ${0.1 * idx}s both`,
                        }}
                        className="group cursor-pointer"
                    >
                        <Card className="h-full hover:shadow-2xl transition-all border-2 border-accent/10 hover:border-accent/50 bg-gradient-to-br from-accent/5 to-background overflow-hidden">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={
                                        attraction.image ||
                                        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(attraction.name + " " + destination)}`
                                    }
                                    alt={attraction.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                                    <span className="px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded-full shadow-lg">
                                        {attraction.category}
                                    </span>
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle className="text-lg text-foreground group-hover:text-accent transition-colors">
                                    {attraction.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">{attraction.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <div className="text-xs font-semibold text-muted-foreground">Entry Fee</div>
                                        <div className="text-lg font-bold text-accent">
                                            {attraction.entryFee === 0 ? "Free" : `₹${attraction.entryFee}`}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <div className="text-xs font-semibold text-muted-foreground">Time</div>
                                        <div className="text-sm font-bold text-primary">{attraction.timeRequired}</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-secondary/10 rounded-lg">
                                    <div className="text-xs font-semibold text-muted-foreground">Best Time</div>
                                    <div className="text-sm font-semibold text-secondary">{attraction.bestTime}</div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-accent/10">
                                    <div className="flex items-center gap-1">
                                        <span>⭐</span>
                                        <span className="font-semibold text-foreground">{attraction.rating}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {attraction.tags.slice(0, 2).map((tag) => (
                                            <span key={tag} className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-semibold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {filteredAttractions.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No attractions found in this category</p>
                </div>
            )}
        </div>
    )
}
