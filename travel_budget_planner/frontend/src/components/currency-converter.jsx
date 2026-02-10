import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, ArrowRightLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function CurrencyConverter() {
    const [amount, setAmount] = useState("1000")
    const [fromCurrency, setFromCurrency] = useState("INR")
    const [toCurrency, setToCurrency] = useState("USD")
    const [convertedAmount, setConvertedAmount] = useState(null)
    const [exchangeRate, setExchangeRate] = useState(null)
    const [loading, setLoading] = useState(false)

    const currencies = [
        { code: "INR", name: "Indian Rupee", symbol: "₹" },
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "EUR", name: "Euro", symbol: "€" },
        { code: "GBP", name: "British Pound", symbol: "£" },
        { code: "JPY", name: "Japanese Yen", symbol: "¥" },
        { code: "AUD", name: "Australian Dollar", symbol: "A$" },
        { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
        { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    ]

    const convertCurrency = async () => {
        if (!amount || parseFloat(amount) <= 0) return
        setLoading(true)

        try {
            const mockRates = {
                INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8, AUD: 0.018, CAD: 0.016, SGD: 0.016, INR: 1 },
                USD: { INR: 83, EUR: 0.92, GBP: 0.79, JPY: 150, AUD: 1.5, CAD: 1.35, SGD: 1.35, USD: 1 },
            }

            const rate = mockRates[fromCurrency]?.[toCurrency] || 1
            setExchangeRate(rate)
            setConvertedAmount(parseFloat(amount) * rate)
        } catch (error) {
            console.error("Currency conversion error:", error)
        }

        setLoading(false)
    }

    useEffect(() => {
        convertCurrency()
    }, [amount, fromCurrency, toCurrency])

    const swapCurrencies = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
    }

    return (
        <Card className="border-2 border-primary/30 shadow-lg animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20">
                <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Real-time Currency Converter
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((curr) => (
                                    <SelectItem key={curr.code} value={curr.code}>
                                        {curr.symbol} {curr.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="text-lg font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((curr) => (
                                    <SelectItem key={curr.code} value={curr.code}>
                                        {curr.symbol} {curr.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg border-2 border-primary/20">
                            {convertedAmount !== null ? (
                                <p className="text-2xl font-bold text-primary">
                                    {currencies.find((c) => c.code === toCurrency)?.symbol}
                                    {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            ) : (
                                <p className="text-muted-foreground">--</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <Button variant="outline" size="sm" onClick={swapCurrencies} className="gap-2">
                        <ArrowRightLeft className="w-4 h-4" />
                        Swap
                    </Button>
                </div>

                {exchangeRate && (
                    <div className="text-center text-sm text-muted-foreground">
                        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
