import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SuggestedPlaces } from "./suggested-places"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function TravelResults({ source, destination, budget, days, travelMode }) {
    const [tripData, setTripData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `/api/trip-details?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&budget=${budget}&days=${days}&travelMode=${travelMode}`,
                )

                if (!response.ok) {
                    throw new Error("Failed to fetch trip details")
                }

                const data = await response.json()
                setTripData(data)
                setError(null)
            } catch (err) {
                setError("Unable to load trip recommendations. Please try again.")
                setTripData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchTripDetails()
    }, [source, destination, budget, days, travelMode])

    const calculateBudgetAllocation = () => {
        const priority = tripData?.spendingPriority || "balanced"
        let transport = 0.25
        let stay = 0.4
        let food = 0.2
        let activities = 0.1

        switch (priority) {
            case "accommodation":
                stay = 0.5; transport = 0.2; food = 0.15; activities = 0.05; break
            case "food":
                food = 0.35; stay = 0.3; transport = 0.2; activities = 0.1; break
            case "activities":
                activities = 0.25; stay = 0.35; transport = 0.2; food = 0.15; break
        }

        return {
            transport: Math.round(budget * transport),
            stay: Math.round(budget * stay),
            food: Math.round(budget * food),
            activities: Math.round(budget * activities),
            misc: Math.round(budget * 0.05),
        }
    }

    const allocation = calculateBudgetAllocation()
    const { transport: transportBudget, stay: stayBudget, food: foodBudget, activities: activitiesBudget, misc: miscBudget } = allocation

    const dailyStayCost = Math.round(stayBudget / days)
    const dailyFoodCost = Math.round(foodBudget / days)
    const totalDailySpend = Math.round(budget / days)

    const getBookingLinks = () => {
        const links = []

        if (travelMode === "domestic") {
            links.push(
                { provider: "Goibibo", url: `https://www.goibibo.com/flights/?from=${source}&to=${destination}&date=${new Date().toISOString().split("T")[0]}`, icon: "🚀" },
                { provider: "MakeMyTrip", url: `https://www.makemytrip.com/flights/?from=${source}&to=${destination}`, icon: "✈️" },
                { provider: "RedBus", url: `https://www.redbus.in/bus-tickets/${source}-to-${destination}`, icon: "🚌" },
            )
        } else {
            links.push(
                { provider: "Skyscanner", url: `https://www.skyscanner.co.in/transport/flights/${source}/${destination}`, icon: "✈️" },
                { provider: "Booking.com", url: `https://www.booking.com/searchresults.html?ss=${destination}`, icon: "🏨" },
                { provider: "Airbnb", url: `https://www.airbnb.co.in/s/${destination}/homes`, icon: "🏠" },
            )
        }

        return links
    }

    if (loading) {
        return (
            <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-secondary"></div>
                    <p className="mt-6 text-lg text-muted-foreground font-medium">Loading your personalized travel plan...</p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-lg text-red-600 font-semibold">{error}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                        Your Dream Trip Awaits
                    </h2>
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="text-2xl font-bold text-primary">{source}</div>
                        <div className="text-3xl">🚀</div>
                        <div className="text-2xl font-bold text-secondary">{destination}</div>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                        {days} Days • {tripData?.groupSize} {tripData?.groupSize === 1 ? "Person" : "People"} • ₹
                        {tripData?.totalBudget?.toLocaleString("en-IN")} Total
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 hover:border-primary/50 transition-all">
                            {tripData?.transportPreference === "mixed" ? "Flexible Transport" : `Prefer ${tripData?.transportPreference}`}
                        </span>
                        <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold border border-secondary/20 hover:border-secondary/50 transition-all">
                            {tripData?.spendingPriority === "balanced" ? "Balanced Spending" : `Focus on ${tripData?.spendingPriority}`}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-5 gap-4 mb-12">
                    {[
                        { label: "Transport", amount: transportBudget, icon: "✈️", color: "primary", delay: 1 },
                        { label: "Stay", amount: stayBudget, icon: "🏨", color: "secondary", delay: 2 },
                        { label: "Food", amount: foodBudget, icon: "🍽️", color: "accent", delay: 3 },
                        { label: "Activities", amount: activitiesBudget, icon: "🎭", color: "primary", delay: 4 },
                        { label: "Misc", amount: miscBudget, icon: "🎁", color: "secondary", delay: 5 },
                    ].map((item) => (
                        <div
                            key={item.label}
                            style={{ animation: `slideInUp 0.6s ease-out ${item.delay * 0.1}s both` }}
                            className="card-hover"
                        >
                            <Card
                                className={`bg-gradient-to-br ${item.color === "primary" ? "from-primary/15 to-primary/5"
                                        : item.color === "secondary" ? "from-secondary/15 to-secondary/5"
                                            : "from-accent/15 to-accent/5"
                                    } border-2 hover:shadow-2xl transition-all`}
                            >
                                <CardContent className="pt-6 text-center">
                                    <div className="text-5xl mb-3 animate-float">{item.icon}</div>
                                    <div className="text-sm font-semibold text-muted-foreground mb-2">{item.label}</div>
                                    <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                        ₹{item.amount.toLocaleString("en-IN")}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-3 font-medium">
                                        {Math.round((item.amount / budget) * 100)}% of budget
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Daily Budget Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        {[
                            { label: "Daily Total", amount: totalDailySpend, icon: "💰", color: "primary" },
                            { label: "Daily Stay", amount: dailyStayCost, icon: "🏠", color: "secondary" },
                            { label: "Daily Food", amount: dailyFoodCost, icon: "🍴", color: "accent" },
                        ].map((item) => (
                            <div key={item.label} className="group cursor-pointer">
                                <div className="p-6 bg-card rounded-lg border-2 transition-all group-hover:shadow-lg">
                                    <div className="text-3xl mb-2">{item.icon}</div>
                                    <div className="text-sm font-semibold text-muted-foreground mb-2">{item.label}</div>
                                    <div className={`text-4xl font-bold ${item.color === "primary" ? "text-primary" : item.color === "secondary" ? "text-secondary" : "text-accent"
                                        }`}>
                                        ₹{item.amount.toLocaleString("en-IN")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {tripData?.data?.transport && (
                    <>
                        {tripData.data.transport.flights && tripData.data.transport.flights.length > 0 && (
                            <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                                <h3 className="text-3xl font-bold text-foreground mb-8">Available Flights ✈️</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {tripData.data.transport.flights.map((flight, idx) => (
                                        <div key={idx} style={{ animation: `slideInUp 0.6s ease-out ${0.5 + idx * 0.1}s both` }} className="card-hover">
                                            <Card className="hover:shadow-2xl transition-all border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-background">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg text-foreground">{flight.name}</CardTitle>
                                                            <CardDescription>Premium Flight Experience</CardDescription>
                                                        </div>
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">LIVE</span>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="p-3 bg-primary/10 rounded-lg">
                                                        <div className="text-xs font-semibold text-muted-foreground">Price</div>
                                                        <div className="text-2xl font-bold text-primary">₹{flight.price.toLocaleString("en-IN")}</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground">Duration</div>
                                                            <div className="text-foreground font-medium">{flight.duration}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground">Rating</div>
                                                            <div className="text-foreground font-medium">⭐ {flight.rating}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {travelMode === "domestic" && tripData.data.transport.trains && tripData.data.transport.trains.length > 0 && (
                            <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                                <h3 className="text-3xl font-bold text-foreground mb-8">Available Trains 🚂</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {tripData.data.transport.trains.map((train, idx) => (
                                        <div key={idx} style={{ animation: `slideInUp 0.6s ease-out ${0.6 + idx * 0.1}s both` }} className="card-hover">
                                            <Card className="hover:shadow-2xl transition-all border-2 border-secondary/10 bg-gradient-to-br from-secondary/5 to-background">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg text-foreground">{train.name}</CardTitle>
                                                            <CardDescription>Comfortable Journey</CardDescription>
                                                        </div>
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ESTIMATED</span>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="p-3 bg-secondary/10 rounded-lg">
                                                        <div className="text-xs font-semibold text-muted-foreground">Price</div>
                                                        <div className="text-2xl font-bold text-secondary">₹{train.price.toLocaleString("en-IN")}</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground">Class</div>
                                                            <div className="text-foreground font-medium">{train.class}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground">Rating</div>
                                                            <div className="text-foreground font-medium">⭐ {train.rating}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {travelMode === "domestic" && tripData.data.transport.buses && tripData.data.transport.buses.length > 0 && (
                            <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                                <h3 className="text-3xl font-bold text-foreground mb-8">Available Buses 🚌</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {tripData.data.transport.buses.map((bus, idx) => (
                                        <div key={idx} style={{ animation: `slideInUp 0.6s ease-out ${0.7 + idx * 0.1}s both` }} className="card-hover">
                                            <Card className="hover:shadow-2xl transition-all border-2 border-accent/10 bg-gradient-to-br from-accent/5 to-background">
                                                <CardHeader>
                                                    <CardTitle className="text-lg text-foreground">{bus.name}</CardTitle>
                                                    <CardDescription>Budget Friendly</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="p-3 bg-accent/10 rounded-lg">
                                                        <div className="text-xs font-semibold text-muted-foreground">Price</div>
                                                        <div className="text-2xl font-bold text-accent">₹{bus.price.toLocaleString("en-IN")}</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground">Type</div>
                                                            <div className="text-foreground font-medium">{bus.type}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground">Rating</div>
                                                            <div className="text-foreground font-medium">⭐ {bus.rating}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tripData.data.transport.localTransport && tripData.data.transport.localTransport.length > 0 && (
                            <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold text-foreground mb-3">Local Transport at {destination} 🚇🚌</h3>
                                    <p className="text-muted-foreground">
                                        Convenient local transit options including metro, buses, and on-demand services for your {days}-day stay
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tripData.data.transport.localTransport.map((transport, idx) => (
                                        <div key={idx} style={{ animation: `slideInUp 0.6s ease-out ${0.8 + idx * 0.1}s both` }} className="card-hover">
                                            <Card className="hover:shadow-2xl transition-all border-2 border-accent/20 bg-gradient-to-br from-accent/10 to-background h-full">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg text-foreground mb-1">{transport.name}</CardTitle>
                                                            <CardDescription className="text-xs font-semibold">{transport.operator}</CardDescription>
                                                        </div>
                                                        <Badge variant="secondary" className="ml-2 text-xs">{transport.type}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg border border-accent/30">
                                                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                                                            {transport.pricePerDay ? `Total for ${days} days` : "One-time Cost"}
                                                        </div>
                                                        <div className="text-3xl font-bold text-accent">₹{transport.price.toLocaleString("en-IN")}</div>
                                                        {transport.pricePerDay && (
                                                            <div className="text-xs text-muted-foreground mt-1 font-medium">₹{transport.pricePerDay}/day</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="text-xs font-semibold text-muted-foreground mb-1">Description</div>
                                                            <div className="text-sm text-foreground leading-relaxed">{transport.description}</div>
                                                        </div>
                                                        {transport.routes && (
                                                            <div>
                                                                <div className="text-xs font-semibold text-muted-foreground mb-1">Routes</div>
                                                                <div className="text-sm text-foreground font-medium">{transport.routes}</div>
                                                            </div>
                                                        )}
                                                        {transport.coverage && (
                                                            <div>
                                                                <div className="text-xs font-semibold text-muted-foreground mb-1">Coverage</div>
                                                                <div className="text-sm text-foreground">{transport.coverage}</div>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between pt-2 border-t border-border">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-yellow-500">⭐</span>
                                                                <span className="font-bold text-foreground">{transport.rating}</span>
                                                                <span className="text-xs text-muted-foreground ml-1">rating</span>
                                                            </div>
                                                            {transport.bookingUrl && (
                                                                <Button size="sm" variant="outline" className="text-xs bg-transparent" onClick={() => window.open(transport.bookingUrl, "_blank")}>
                                                                    Learn More
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">💡</div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-2">Pro Tip for Local Transport</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Multi-day passes offer the best value for frequent travelers. Metro systems are fastest for avoiding traffic, while buses provide the widest coverage. Consider buying rechargeable smart cards at the start of your trip for seamless travel across the city.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {tripData?.data?.accommodation && (
                    <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
                        <h3 className="text-3xl font-bold text-foreground mb-8">Accommodation Options 🏨</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {tripData.data.accommodation.map((hotel, idx) => (
                                <div key={idx} style={{ animation: `slideInUp 0.6s ease-out ${0.9 + idx * 0.1}s both` }} className="card-hover">
                                    <Card className="hover:shadow-2xl transition-all border-2 border-secondary/10 bg-gradient-to-br from-secondary/5 to-background">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-foreground">{hotel.name}</CardTitle>
                                            <CardDescription>Full trip accommodation</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-3 bg-secondary/10 rounded-lg">
                                                <div className="text-xs font-semibold text-muted-foreground">Per Night</div>
                                                <div className="text-2xl font-bold text-secondary">₹{hotel.price.toLocaleString("en-IN")}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-muted-foreground">Total ({days} nights)</div>
                                                <div className="text-xl font-bold text-foreground">₹{(hotel.price * days).toLocaleString("en-IN")}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-muted-foreground">Amenities</div>
                                                <div className="text-sm text-foreground">{hotel.amenities}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">⭐</span>
                                                <span className="text-foreground font-medium">{hotel.rating}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tripData?.data?.restaurants && (
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
                        <h3 className="text-3xl font-bold text-foreground mb-8">Restaurant Options 🍽️</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {tripData.data.restaurants.map((restaurant, idx) => (
                                <div key={idx} style={{ animation: `slideInUp 0.6s ease-out ${1.0 + idx * 0.1}s both` }} className="card-hover">
                                    <Card className="hover:shadow-2xl transition-all border-2 border-accent/10 bg-gradient-to-br from-accent/5 to-background">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-foreground">{restaurant.name}</CardTitle>
                                            <CardDescription>{restaurant.cuisine}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-3 bg-accent/10 rounded-lg">
                                                <div className="text-xs font-semibold text-muted-foreground">Daily Cost</div>
                                                <div className="text-2xl font-bold text-accent">₹{restaurant.price.toLocaleString("en-IN")}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-muted-foreground">Trip Total ({days} days)</div>
                                                <div className="text-xl font-bold text-foreground">₹{(restaurant.price * days).toLocaleString("en-IN")}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">⭐</span>
                                                <span className="text-foreground font-medium">{restaurant.rating}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-20 pt-12 border-t-2 border-primary/10 animate-fade-in-up" style={{ animationDelay: "1s" }}>
                    <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Book Directly On Partner Sites</h3>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {getBookingLinks().map((link, idx) => (
                            <a key={link.provider} href={link.url} target="_blank" rel="noopener noreferrer" className="group" style={{ animation: `slideInUp 0.6s ease-out ${1.1 + idx * 0.1}s both` }}>
                                <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20 hover:border-primary/50 group-hover:shadow-xl transition-all duration-300">
                                    <div className="text-4xl mb-3">{link.icon}</div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">{link.provider}</h4>
                                    <p className="text-sm text-muted-foreground mb-4">Book on partner site for best deals</p>
                                    <button className="w-full py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold group-hover:shadow-lg transition-all">
                                        Visit →
                                    </button>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-20 pt-12 border-t-2 border-accent/10 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
                    <SuggestedPlaces destination={destination} budget={budget} days={days} />
                </div>
            </div>
        </section>
    )
}
