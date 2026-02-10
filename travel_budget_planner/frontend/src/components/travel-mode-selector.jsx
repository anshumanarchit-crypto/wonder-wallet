import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TravelModeSelector({ onModeChange }) {
    const [selectedMode, setSelectedMode] = useState("domestic")

    const handleModeChange = (mode) => {
        setSelectedMode(mode)
        onModeChange(mode)
    }

    return (
        <section id="travel-mode" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        Where Do You Want to <span className="text-primary">Explore?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose your travel style and get personalized budget recommendations
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
                    <Card
                        className={`border-2 cursor-pointer transition-all overflow-hidden hover:shadow-xl ${selectedMode === "domestic"
                                ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg scale-105"
                                : "border-secondary/30 hover:border-primary/50 hover:shadow-md"
                            }`}
                        onClick={() => handleModeChange("domestic")}
                    >
                        <CardContent className="pt-8 pb-8">
                            <div className="text-center space-y-4">
                                <div className="text-6xl">🇮🇳</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Explore India</h3>
                                    <p className="text-muted-foreground text-sm">Domestic travel across amazing destinations</p>
                                </div>
                                <div className="pt-4 space-y-2 border-t border-secondary/20">
                                    <div className="text-sm text-foreground">
                                        <span className="font-semibold text-primary">₹2,000</span> - ₹2,00,000
                                    </div>
                                    <div className="text-xs text-muted-foreground">Including trains, buses & flights</div>
                                </div>
                                {selectedMode === "domestic" && (
                                    <div className="mt-4 inline-block bg-primary text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                                        Selected
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`border-2 cursor-pointer transition-all overflow-hidden hover:shadow-xl ${selectedMode === "international"
                                ? "border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-lg scale-105"
                                : "border-secondary/30 hover:border-secondary/50 hover:shadow-md"
                            }`}
                        onClick={() => handleModeChange("international")}
                    >
                        <CardContent className="pt-8 pb-8">
                            <div className="text-center space-y-4">
                                <div className="text-6xl">✈️</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">International Travel</h3>
                                    <p className="text-muted-foreground text-sm">Explore the world with expert guidance</p>
                                </div>
                                <div className="pt-4 space-y-2 border-t border-secondary/20">
                                    <div className="text-sm text-foreground">
                                        <span className="font-semibold text-secondary">₹50,000</span> - ₹12,50,000
                                    </div>
                                    <div className="text-xs text-muted-foreground">All destinations worldwide</div>
                                </div>
                                {selectedMode === "international" && (
                                    <div className="mt-4 inline-block bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                                        Selected
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <Button
                        size="lg"
                        onClick={() => {
                            const element = document.getElementById("calculator")
                            element?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base shadow-lg"
                    >
                        Start Planning Your {selectedMode === "domestic" ? "India" : "International"} Trip
                    </Button>
                </div>
            </div>
        </section>
    )
}
