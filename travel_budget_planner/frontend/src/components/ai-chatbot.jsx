import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { sendChatMessage } from "@/lib/api-client"

export function AIChatbot() {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            content:
                "👋 Hi! I'm your AI travel assistant powered by Google Gemini. I can help you:\n\n" +
                "- 💰 **Calculate trip expenses** for any destination\n" +
                "- 📋 **Generate detailed itineraries** with day-by-day plans\n" +
                "- 🏨 **Estimate stay costs** for hotels and accommodations\n" +
                "- 🚗 **Estimate transport costs** between cities\n" +
                "- 📍 **Recommend places** to visit at your destination\n\n" +
                "Try asking something like:\n" +
                '> *"Plan a 5-day trip to Goa from Delhi with a budget of ₹30,000"*\n\n' +
                '> *"What are the best places to visit in Rajasthan?"*',
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [conversationHistory, setConversationHistory] = useState([])
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            const result = await sendChatMessage(input.trim(), conversationHistory)

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: result.response || "I apologize, I couldn't process that request. Please try again.",
            }

            setMessages((prev) => [...prev, assistantMessage])
            setConversationHistory(result.conversationHistory || [])
        } catch (error) {
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "❌ Sorry, I encountered an error. Please make sure the backend server is running and try again.",
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const clearChat = () => {
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: "👋 Chat cleared! How can I help you plan your next trip?",
            },
        ])
        setConversationHistory([])
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">AI Trip Planner</h2>
                                <p className="text-xs text-muted-foreground font-normal">Powered by Google Gemini & LangGraph</p>
                            </div>
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-foreground">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Messages Area */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {message.role === "assistant" && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                                            : "bg-muted/50 border border-border"
                                        }`}
                                >
                                    {message.role === "assistant" ? (
                                        <div className="chatbot-markdown prose prose-sm max-w-none dark:prose-invert">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{message.content}</p>
                                    )}
                                </div>
                                {message.role === "user" && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-4 h-4 text-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 justify-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-muted/50 border border-border rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-sm text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-border p-4 bg-muted/20">
                        <div className="flex gap-3">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask me about trip planning, budgets, itineraries..."
                                className="flex-1 bg-background border-2 border-primary/20 focus:border-primary py-3 text-base"
                                disabled={loading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg px-6"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Press Enter to send • Shift+Enter for new line
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
