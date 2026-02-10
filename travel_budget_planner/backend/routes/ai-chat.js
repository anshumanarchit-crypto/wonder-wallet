import { Router } from 'express';
import { createTripPlannerAgent, SYSTEM_PROMPT, HumanMessage, SystemMessage, AIMessage } from '../agents/trip-planner-agent.js';

const router = Router();

let agentApp = null;

async function getAgent() {
    if (!agentApp) {
        agentApp = await createTripPlannerAgent();
    }
    return agentApp;
}

router.post('/', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ status: "error", message: "Message is required" });
        }

        const agent = await getAgent();

        if (!agent) {
            // Fallback if no API key is configured
            return res.json({
                status: "success",
                response: "⚠️ AI chatbot is not configured. Please set the `GOOGLE_API_KEY` environment variable in the backend `.env` file to enable the AI trip planner.\n\nYou can get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).",
                toolsUsed: [],
            });
        }

        // Build messages array
        const messages = [new SystemMessage(SYSTEM_PROMPT)];

        // Add conversation history
        for (const msg of conversationHistory.slice(-10)) {
            if (msg.role === "user") {
                messages.push(new HumanMessage(msg.content));
            } else if (msg.role === "assistant") {
                messages.push(new AIMessage(msg.content));
            }
        }

        // Add current message
        messages.push(new HumanMessage(message));

        // Invoke the agent
        const result = await agent.invoke({ messages });

        // Extract the final AI response
        const aiMessages = result.messages.filter(m => m instanceof AIMessage || m._getType?.() === "ai");
        const lastAiMessage = aiMessages[aiMessages.length - 1];
        const responseText = typeof lastAiMessage?.content === 'string'
            ? lastAiMessage.content
            : lastAiMessage?.content?.map(c => c.text || '').join('') || "I apologize, I couldn't generate a response. Please try again.";

        // Collect tools used
        const toolsUsed = result.messages
            .filter(m => m._getType?.() === "tool")
            .map(m => m.name);

        res.json({
            status: "success",
            response: responseText,
            toolsUsed: [...new Set(toolsUsed)],
        });

    } catch (error) {
        console.error("AI Chat error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to process your request. Please try again.",
            error: error.message,
        });
    }
});

export default router;
