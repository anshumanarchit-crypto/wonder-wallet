import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, DollarSign, Navigation } from 'lucide-react'

export function NearbyPlacesSection({ city, latitude, longitude }) {
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("all")
    const [detectedCity, setDetectedCity] = useState("")

    useEffect(() => {
        if (city || (latitude && longitude)) {
            fetchNearbyPlaces()
        }
    }, [city, latitude, longitude])

    const fetchNearbyPlaces = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (city) params.append("city", city)
            if (latitude) params.append("lat", latitude.toString())
            if (longitude) params.append("lng", longitude.toString())

            const response = await fetch(`/api/nearby-places?${params.toString()}`)
            const data = await response.json()
            setPlaces(data.places || [])
            setDetectedCity(data.city || city)
        } catch (err) {
            console.error("Error fetching nearby places:", err)
        }
        setLoading(false)
    }

    const categories = ["all", "restaurants", "monuments", "beaches", "adventure", "shopping"]
    const filteredPlaces = filter === "all" ? places : places.filter((p) => p.type.toLowerCase() === filter)

    return (
        <div className="space-y-6 animate-fade-in-up">
            <Card className="border-2 border-primary/30 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-primary animate-pulse" />
                            <span>Nearby Places in {detectedCity || city}</span>
                        </div>
                        <span className="text-sm font-normal text-muted-foreground">
                            {filteredPlaces.length} places found
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                variant={filter === cat ? "default" : "outline"}
                                size="sm"
                                className="capitalize"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Loading nearby places...</p>
                        </div>
                    ) : filteredPlaces.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPlaces.map((place) => (
                                <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all card-hover">
                                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                                        <img
                                            src={place.image || "/placeholder.svg"}
                                            alt={place.name}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-foreground mb-1">{place.name}</h3>
                                        <p className="text-xs text-primary font-semibold mb-2 capitalize">{place.type}</p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                {place.distance}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                {place.rating}/5 Rating
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                {place.visitTime}
                                            </div>
                                            {place.entryFee && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <DollarSign className="w-4 h-4" />
                                                    {place.entryFee}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{place.description}</p>

                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {place.tags.map((tag) => (
                                                <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No places found for this filter</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
