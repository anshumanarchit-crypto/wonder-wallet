import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AIChatbot } from "@/components/ai-chatbot"

export function ChatPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Note: Header is provided by DashboardLayout, so we don't need it here if strictly inside layout.
           However, keeping standalone capability if needed. 
           But if rendered inside DashboardLayout, layout provides header.
           Let's make it simpler: ChatPage content only.
        */}
            <main className="flex-grow pt-4">
                <div className="text-center mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                        AI Trip Planner
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Chat with our AI to plan your perfect trip, get budget estimates, and personalized itineraries
                    </p>
                </div>
                <AIChatbot />
            </main>
        </div>
    )
}
