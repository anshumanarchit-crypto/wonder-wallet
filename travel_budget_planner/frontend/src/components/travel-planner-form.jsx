import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DOMESTIC_CITIES = [
    "Delhi", "Mumbai", "Goa", "Kerala", "Rajasthan", "Jaipur",
    "Agra", "Bangalore", "Hyderabad", "Kolkata", "Pune", "Ahmedabad",
]

const INTERNATIONAL_DESTINATIONS = [
    "India", "Bangkok", "Bali", "Dubai", "Singapore",
    "Tokyo", "Paris", "London", "New York", "Barcelona", "Amsterdam",
]

export function TravelPlannerForm({ onSubmit }) {
    const [source, setSource] = useState("")
    const [destination, setDestination] = useState("")
    const [budget, setBudget] = useState(25000)
    const [days, setDays] = useState(3)
    const [travelMode, setTravelMode] = useState("domestic")
    const [groupSize, setGroupSize] = useState(1)
    const [transportPreference, setTransportPreference] = useState("mixed")
    const [spendingPriority, setSpendingPriority] = useState("balanced")
    const [sourceShowSuggestions, setSourceShowSuggestions] = useState(false)
    const [destShowSuggestions, setDestShowSuggestions] = useState(false)

    const suggestions = travelMode === "domestic" ? DOMESTIC_CITIES : INTERNATIONAL_DESTINATIONS
    const sourceSuggestions = suggestions.filter((s) => s.toLowerCase().includes(source.toLowerCase()))
    const destSuggestions = suggestions.filter((s) => s.toLowerCase().includes(destination.toLowerCase()))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (source.trim() && destination.trim() && source !== destination) {
            onSubmit({
                source: source.trim(),
                destination: destination.trim(),
                budget: Number(budget),
                days: Number(days),
                travelMode,
                groupSize: Number(groupSize),
                transportPreference,
                spendingPriority,
            })
        }
    }

    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4">
                <Card className="border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all card-hover">
                    <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30">
                        <CardTitle className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Plan Your Trip
                        </CardTitle>
                        <CardDescription className="text-base mt-3">
                            Enter your source, destination, budget, and preferences to get personalized travel recommendations
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Travel Mode Selection */}
                            <div className="animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                                <label className="block text-sm font-semibold text-foreground mb-3">Travel Type</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTravelMode("domestic")
                                            setSource("")
                                            setDestination("")
                                            setTransportPreference("mixed")
                                        }}
                                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${travelMode === "domestic"
                                                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                                : "bg-muted text-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        🇮🇳 Within India
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTravelMode("international")
                                            setSource("")
                                            setDestination("")
                                            setTransportPreference("flightOnly")
                                        }}
                                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${travelMode === "international"
                                                ? "bg-secondary text-secondary-foreground shadow-lg scale-105"
                                                : "bg-muted text-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        🌍 International
                                    </button>
                                </div>
                            </div>

                            {/* Source and Destination Inputs */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Source Input */}
                                <div className="animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                                    <label htmlFor="source" className="block text-sm font-semibold text-foreground mb-2">
                                        📍 From (Source)
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="source"
                                            type="text"
                                            placeholder={`Enter your starting city in ${travelMode === "domestic" ? "India" : "the world"}`}
                                            value={source}
                                            onChange={(e) => setSource(e.target.value)}
                                            onFocus={() => setSourceShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setSourceShowSuggestions(false), 200)}
                                            className="py-3 px-4 text-base border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        {sourceShowSuggestions && sourceSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-primary/30 rounded-lg shadow-2xl z-10 animate-scale-in">
                                                {sourceSuggestions.map((suggestion) => (
                                                    <button
                                                        key={suggestion}
                                                        type="button"
                                                        onClick={() => {
                                                            setSource(suggestion)
                                                            setSourceShowSuggestions(false)
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-primary/15 transition-all text-foreground font-medium border-b border-border last:border-b-0"
                                                    >
                                                        📍 {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Destination Input */}
                                <div className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                                    <label htmlFor="destination" className="block text-sm font-semibold text-foreground mb-2">
                                        🎯 To (Destination)
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="destination"
                                            type="text"
                                            placeholder={`Enter your destination in ${travelMode === "domestic" ? "India" : "the world"}`}
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            onFocus={() => setDestShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setDestShowSuggestions(false), 200)}
                                            className="py-3 px-4 text-base border-2 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                                        />
                                        {destShowSuggestions && destSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-secondary/30 rounded-lg shadow-2xl z-10 animate-scale-in">
                                                {destSuggestions.map((suggestion) => (
                                                    <button
                                                        key={suggestion}
                                                        type="button"
                                                        onClick={() => {
                                                            setDestination(suggestion)
                                                            setDestShowSuggestions(false)
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-secondary/15 transition-all text-foreground font-medium border-b border-border last:border-b-0"
                                                    >
                                                        🎯 {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Budget Slider */}
                            <div className="animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
                                <label htmlFor="budget" className="block text-sm font-semibold text-foreground mb-3">
                                    Budget: <span className="text-primary font-bold">₹{budget.toLocaleString("en-IN")}</span>
                                </label>
                                <input
                                    id="budget"
                                    type="range"
                                    min={travelMode === "domestic" ? 2000 : 50000}
                                    max={travelMode === "domestic" ? 200000 : 1250000}
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="w-full h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-secondary transition-all"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
                                    <span>₹{(travelMode === "domestic" ? 2000 : 50000).toLocaleString("en-IN")}</span>
                                    <span>₹{(travelMode === "domestic" ? 200000 : 1250000).toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            {/* Days Input */}
                            <div className="animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
                                <label htmlFor="days" className="block text-sm font-semibold text-foreground mb-2">
                                    Number of Days 📅
                                </label>
                                <Input
                                    id="days"
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={days}
                                    onChange={(e) => setDays(Math.max(1, Math.min(30, Number(e.target.value))))}
                                    className="py-3 px-4 text-base border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            {/* Group Size */}
                            <div className="animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
                                <label htmlFor="groupSize" className="block text-sm font-semibold text-foreground mb-2">
                                    Group Size (Number of People) 👥
                                </label>
                                <Input
                                    id="groupSize"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={groupSize}
                                    onChange={(e) => setGroupSize(Math.max(1, Math.min(20, Number(e.target.value))))}
                                    className="py-3 px-4 text-base border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground mt-2 font-medium">
                                    💡 Per person budget: ₹{Math.round(budget / groupSize).toLocaleString("en-IN")}
                                </p>
                            </div>

                            {/* Transport Preference */}
                            <div className="animate-slide-in-right" style={{ animationDelay: "0.6s" }}>
                                <label className="block text-sm font-semibold text-foreground mb-3">Transport Preference 🚗</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {travelMode === "domestic" ? (
                                        <>
                                            {["flight", "train", "bus", "mixed"].map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setTransportPreference(option)}
                                                    className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm transform hover:scale-105 ${transportPreference === option
                                                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                                            : "bg-muted text-foreground hover:bg-muted/80"
                                                        }`}
                                                >
                                                    {option === "flight" && "✈️ Flight"}
                                                    {option === "train" && "🚂 Train"}
                                                    {option === "bus" && "🚌 Bus"}
                                                    {option === "mixed" && "🔀 Mixed"}
                                                </button>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setTransportPreference("flightOnly")}
                                                className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm transform hover:scale-105 col-span-2 ${transportPreference === "flightOnly"
                                                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                                        : "bg-muted text-foreground hover:bg-muted/80"
                                                    }`}
                                            >
                                                ✈️ Flight Only
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTransportPreference("flightWithLocal")}
                                                className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm transform hover:scale-105 col-span-2 ${transportPreference === "flightWithLocal"
                                                        ? "bg-secondary text-secondary-foreground shadow-lg scale-105"
                                                        : "bg-muted text-foreground hover:bg-muted/80"
                                                    }`}
                                            >
                                                ✈️🚕 Flight + Local Transport
                                            </button>
                                        </>
                                    )}
                                </div>
                                {travelMode === "international" && transportPreference === "flightWithLocal" && (
                                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                                        💡 Includes airport transfers, metros, taxis, and local buses at your destination
                                    </p>
                                )}
                            </div>

                            {/* Spending Priority */}
                            <div className="animate-slide-in-left" style={{ animationDelay: "0.7s" }}>
                                <label className="block text-sm font-semibold text-foreground mb-3">Where to Spend More 💸</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { key: "accommodation", label: "🏨 Stay", emoji: "🏨" },
                                        { key: "food", label: "🍽️ Food", emoji: "🍽️" },
                                        { key: "activities", label: "🎭 Activities", emoji: "🎭" },
                                        { key: "balanced", label: "⚖️ Balanced", emoji: "⚖️" },
                                    ].map((option) => (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => setSpendingPriority(option.key)}
                                            className={`py-3 px-4 rounded-lg font-semibold transition-all text-sm transform hover:scale-105 ${spendingPriority === option.key
                                                    ? "bg-secondary text-secondary-foreground shadow-lg scale-105"
                                                    : "bg-muted text-foreground hover:bg-muted/80"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={source === destination || !source || !destination}
                                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl text-primary-foreground font-bold py-6 text-lg rounded-lg transition-all transform hover:scale-105 card-hover animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ animationDelay: "0.8s" }}
                            >
                                ✨ Generate Travel Plan
                            </Button>
                            {source === destination && (
                                <p className="text-sm text-center text-red-600 font-medium">Source and destination must be different</p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
