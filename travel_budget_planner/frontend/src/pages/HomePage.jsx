import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TravelModeSelector } from "@/components/travel-mode-selector"
import { BudgetCalculator } from "@/components/budget-calculator"
import { BudgetCalculatorDomestic } from "@/components/budget-calculator-domestic"
import { BudgetCalculatorInternational } from "@/components/budget-calculator-international"
import { TravelPlannerForm } from "@/components/travel-planner-form"
import { TravelResults } from "@/components/travel-results"
import { Dashboard } from "@/components/dashboard"
import { RecommendationsSection } from "@/components/recommendations-section"
import { DestinationComparison } from "@/components/destination-comparison"
import { ExpenseTracker } from "@/components/expense-tracker"
import { CurrencyConverter } from "@/components/currency-converter"
import { CostSavingTips } from "@/components/cost-saving-tips"
import { BudgetAlerts } from "@/components/budget-alerts"
import { CollaborativePlanning } from "@/components/collaborative-planning"
import { LocationMap } from "@/components/location-map"
import { NearbyPlacesSection } from "@/components/nearby-places-section"
import { Footer } from "@/components/footer"

export function HomePage() {
    const [travelMode, setTravelMode] = useState("domestic")
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [detectedLocation, setDetectedLocation] = useState(null)

    const handlePlanSubmit = (plan) => {
        setSelectedPlan(plan)
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <HeroSection />

                {/* Location Detection */}
                <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                    <div className="max-w-4xl mx-auto px-4">
                        <LocationMap onLocationSelect={(loc) => setDetectedLocation(loc)} />
                    </div>
                </section>

                {/* Nearby Places (if location detected) */}
                {detectedLocation && (
                    <section className="py-12 md:py-16 bg-background">
                        <div className="max-w-7xl mx-auto px-4">
                            <NearbyPlacesSection
                                city={detectedLocation.city}
                                latitude={detectedLocation.lat}
                                longitude={detectedLocation.lng}
                            />
                        </div>
                    </section>
                )}

                <TravelModeSelector mode={travelMode} setMode={setTravelMode} />

                {travelMode === "domestic" ? <BudgetCalculatorDomestic /> : <BudgetCalculatorInternational />}

                <BudgetCalculator />

                {/* Travel Planner Form */}
                <TravelPlannerForm onSubmit={handlePlanSubmit} />

                {/* Travel Results */}
                {selectedPlan && (
                    <TravelResults
                        source={selectedPlan.source}
                        destination={selectedPlan.destination}
                        budget={selectedPlan.budget}
                        days={selectedPlan.days}
                        travelMode={selectedPlan.travelMode}
                    />
                )}

                <Dashboard />

                <RecommendationsSection />

                <DestinationComparison />

                {/* Additional Tools Section */}
                <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Travel Tools</h2>
                            <p className="text-muted-foreground text-lg">Everything you need for a perfect trip</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <ExpenseTracker />
                            <CurrencyConverter />
                            <CostSavingTips />
                            <BudgetAlerts />
                        </div>
                        <div className="mt-8">
                            <CollaborativePlanning />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
