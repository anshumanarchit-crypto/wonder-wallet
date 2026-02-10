import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from 'lucide-react'

export function LocationMap({ onLocationSelect }) {
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const getCurrentLocation = () => {
        setLoading(true)
        setError("")

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser")
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                    )
                    const data = await response.json()

                    const cityName =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.state_district ||
                        data.address?.county ||
                        "Unknown Location"

                    const locationData = {
                        lat: latitude,
                        lng: longitude,
                        city: cityName,
                        country: data.address?.country || "Unknown",
                    }

                    setLocation(locationData)
                    onLocationSelect?.(locationData)
                } catch (err) {
                    setError("Could not fetch location details")
                }
                setLoading(false)
            },
            (err) => {
                setError(`Error getting location: ${err.message}`)
                setLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }

    return (
        <Card className="border-2 border-primary/30 shadow-lg card-hover animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30">
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Detect Your Location
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <Button
                        onClick={getCurrentLocation}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground font-semibold py-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Detecting Location...
                            </>
                        ) : (
                            <>
                                <MapPin className="w-4 h-4 mr-2" />
                                Get My Current Location
                            </>
                        )}
                    </Button>

                    {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

                    {location && (
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground mb-2">Your Current Location:</p>
                            <p className="text-lg font-bold text-foreground">{location.city}, {location.country}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </p>
                        </div>
                    )}

                    {location && (
                        <iframe
                            width="100%"
                            height="300"
                            frameBorder="0"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.05},${location.lat - 0.05},${location.lng + 0.05},${location.lat + 0.05}&layer=mapnik&marker=${location.lat},${location.lng}`}
                            className="rounded-lg border border-primary/30"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
