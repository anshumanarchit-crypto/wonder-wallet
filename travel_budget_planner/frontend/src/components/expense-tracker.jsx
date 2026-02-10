import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, TrendingUp } from 'lucide-react'

export function ExpenseTracker() {
    const [expenses, setExpenses] = useState([])
    const [newExpense, setNewExpense] = useState({
        category: "transport",
        amount: "",
        description: "",
    })

    const categories = [
        { value: "transport", label: "🚗 Transport", color: "bg-blue-500" },
        { value: "accommodation", label: "🏨 Accommodation", color: "bg-purple-500" },
        { value: "food", label: "🍽️ Food", color: "bg-orange-500" },
        { value: "activities", label: "🎭 Activities", color: "bg-green-500" },
        { value: "shopping", label: "🛍️ Shopping", color: "bg-pink-500" },
        { value: "miscellaneous", label: "📦 Miscellaneous", color: "bg-gray-500" },
    ]

    const addExpense = () => {
        if (newExpense.amount && newExpense.description) {
            const expense = {
                id: Date.now().toString(),
                category: newExpense.category,
                amount: parseFloat(newExpense.amount),
                description: newExpense.description,
                date: new Date().toISOString(),
            }
            setExpenses([...expenses, expense])
            setNewExpense({ category: "transport", amount: "", description: "" })
        }
    }

    const deleteExpense = (id) => {
        setExpenses(expenses.filter((e) => e.id !== id))
    }

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
    }, {})

    return (
        <Card className="border-2 border-primary/30 shadow-lg animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20">
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Expense Tracker
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Add Expense Form */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Amount (₹)"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                    <Input
                        placeholder="Description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                    <Button onClick={addExpense} className="bg-gradient-to-r from-primary to-secondary">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>

                {/* Total Spent */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg border-2 border-primary/30">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
                        <p className="text-4xl font-bold text-primary">₹{totalSpent.toLocaleString()}</p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                        const total = categoryTotals[cat.value] || 0
                        return (
                            <div key={cat.value} className="bg-card border-2 border-border rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">{cat.label}</p>
                                <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Expenses List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {expenses.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No expenses added yet</p>
                    ) : (
                        expenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-semibold">{expense.description}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{expense.category}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-primary">₹{expense.amount.toLocaleString()}</p>
                                    <Button variant="ghost" size="sm" onClick={() => deleteExpense(expense.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
