import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation, END, START } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

// ── Tool Definitions ──────────────────────────────────────────

const calculateTripExpenses = tool(
    async ({ destination, days, groupSize, budgetTier, travelMode }) => {
        const baseCosts = {
            budget: { stay: 800, food: 500, transport: 300, activities: 200, misc: 150 },
            standard: { stay: 2500, food: 1200, transport: 800, activities: 600, misc: 300 },
            luxury: { stay: 8000, food: 3000, transport: 2000, activities: 1500, misc: 800 },
        };

        const internationalMultiplier = travelMode === "international" ? 3.5 : 1;
        const tier = baseCosts[budgetTier] || baseCosts.standard;

        const dailyCost = {
            accommodation: Math.round(tier.stay * internationalMultiplier),
            food: Math.round(tier.food * internationalMultiplier),
            localTransport: Math.round(tier.transport * internationalMultiplier),
            activities: Math.round(tier.activities * internationalMultiplier),
            miscellaneous: Math.round(tier.misc * internationalMultiplier),
        };

        const dailyTotal = Object.values(dailyCost).reduce((a, b) => a + b, 0);
        const totalPerPerson = dailyTotal * days;
        const grandTotal = totalPerPerson * groupSize;

        // Add intercity transport estimate
        const intercityTransport = travelMode === "international"
            ? Math.round(15000 + Math.random() * 25000)
            : Math.round(2000 + Math.random() * 5000);

        return JSON.stringify({
            destination,
            days,
            groupSize,
            budgetTier,
            travelMode,
            dailyBreakdown: dailyCost,
            dailyTotal,
            intercityTransport: intercityTransport * groupSize,
            totalPerPerson: totalPerPerson + intercityTransport,
            grandTotal: grandTotal + (intercityTransport * groupSize),
            currency: "INR",
            note: "All prices are approximate estimates in Indian Rupees (₹)",
        });
    },
    {
        name: "calculate_trip_expenses",
        description: "Calculate approximate total trip expenses based on destination, number of days, group size, budget tier (budget/standard/luxury), and travel mode (domestic/international). Returns detailed cost breakdown in INR.",
        schema: z.object({
            destination: z.string().describe("Travel destination city/place"),
            days: z.number().describe("Number of days for the trip"),
            groupSize: z.number().describe("Number of people traveling"),
            budgetTier: z.enum(["budget", "standard", "luxury"]).describe("Budget category"),
            travelMode: z.enum(["domestic", "international"]).describe("Whether domestic or international trip"),
        }),
    }
);

const generateItinerary = tool(
    async ({ destination, days, interests, budgetTier }) => {
        const activities = {
            Delhi: {
                morning: ["Visit Red Fort", "Explore Chandni Chowk", "Jama Masjid Tour", "Humayun's Tomb", "Qutub Minar"],
                afternoon: ["India Gate", "Khan Market Shopping", "National Museum", "Lotus Temple", "Akshardham Temple"],
                evening: ["Hauz Khas Village", "Connaught Place Dinner", "Dilli Haat", "Kingdom of Dreams", "Street Food Walk"],
            },
            Mumbai: {
                morning: ["Gateway of India", "Elephanta Caves", "Siddhivinayak Temple", "Haji Ali Dargah", "Colaba Market"],
                afternoon: ["Marine Drive Walk", "Bandra-Worli Sea Link", "Chor Bazaar", "Film City Tour", "Juhu Beach"],
                evening: ["Marine Drive Sunset", "Bandra Bandstand", "Carter Road Cafes", "Leopold Cafe", "Nariman Point"],
            },
            Goa: {
                morning: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls Trek", "Anjuna Beach"],
                afternoon: ["Spice Plantation Tour", "Palolem Beach", "Chapora Fort", "Water Sports", "Reis Magos Fort"],
                evening: ["Tito's Lane Nightlife", "Beach Shack Dinner", "Sunset at Vagator", "Saturday Night Market", "Casino Cruise"],
            },
            Bangalore: {
                morning: ["Lalbagh Gardens", "Nandi Hills Sunrise", "ISKCON Temple", "Cubbon Park", "Vidhana Soudha"],
                afternoon: ["UB City Mall", "Bangalore Palace", "HAL Museum", "Wonderla", "Commercial Street"],
                evening: ["MG Road", "Indiranagar Pubs", "Koramangala Cafes", "Brewery Visit", "VV Puram Food Street"],
            },
        };

        const cityActivities = activities[destination] || activities["Delhi"];

        const itinerary = [];
        for (let day = 1; day <= days; day++) {
            const morningIdx = (day - 1) % cityActivities.morning.length;
            const afternoonIdx = (day - 1) % cityActivities.afternoon.length;
            const eveningIdx = (day - 1) % cityActivities.evening.length;

            itinerary.push({
                day,
                morning: { time: "8:00 AM - 12:00 PM", activity: cityActivities.morning[morningIdx], estimatedCost: budgetTier === "luxury" ? "₹2,000-5,000" : budgetTier === "budget" ? "₹100-500" : "₹500-1,500" },
                afternoon: { time: "12:30 PM - 5:00 PM", activity: cityActivities.afternoon[afternoonIdx], estimatedCost: budgetTier === "luxury" ? "₹3,000-8,000" : budgetTier === "budget" ? "₹200-800" : "₹800-2,000" },
                evening: { time: "6:00 PM - 10:00 PM", activity: cityActivities.evening[eveningIdx], estimatedCost: budgetTier === "luxury" ? "₹5,000-15,000" : budgetTier === "budget" ? "₹300-1,000" : "₹1,000-3,000" },
                meals: { breakfast: budgetTier === "luxury" ? "Hotel restaurant" : "Local café", lunch: "Restaurant near activity", dinner: budgetTier === "luxury" ? "Fine dining" : "Local cuisine" },
            });
        }

        return JSON.stringify({ destination, days, budgetTier, interests, itinerary });
    },
    {
        name: "generate_itinerary",
        description: "Generate a detailed day-by-day travel itinerary with activities, timings, estimated costs, and meal suggestions for a given destination.",
        schema: z.object({
            destination: z.string().describe("Travel destination"),
            days: z.number().describe("Number of days"),
            interests: z.string().describe("Travel interests like culture, adventure, food, shopping etc."),
            budgetTier: z.enum(["budget", "standard", "luxury"]).describe("Budget tier"),
        }),
    }
);

const recommendPlaces = tool(
    async ({ budget, days, interests, travelMode }) => {
        const allPlaces = [
            { name: "Goa", type: "domestic", minBudget: 8000, bestFor: ["beach", "nightlife", "adventure", "relaxation"], rating: 4.7, bestSeason: "Oct-Mar" },
            { name: "Delhi", type: "domestic", minBudget: 5000, bestFor: ["history", "culture", "food", "shopping"], rating: 4.5, bestSeason: "Oct-Mar" },
            { name: "Mumbai", type: "domestic", minBudget: 8000, bestFor: ["city", "food", "bollywood", "nightlife"], rating: 4.6, bestSeason: "Nov-Feb" },
            { name: "Bangalore", type: "domestic", minBudget: 6000, bestFor: ["tech", "food", "nightlife", "nature"], rating: 4.4, bestSeason: "Sep-Feb" },
            { name: "Jaipur", type: "domestic", minBudget: 5000, bestFor: ["history", "culture", "architecture", "shopping"], rating: 4.6, bestSeason: "Oct-Mar" },
            { name: "Kerala", type: "domestic", minBudget: 10000, bestFor: ["nature", "backwaters", "ayurveda", "relaxation"], rating: 4.8, bestSeason: "Sep-Mar" },
            { name: "Manali", type: "domestic", minBudget: 7000, bestFor: ["adventure", "nature", "snow", "trekking"], rating: 4.5, bestSeason: "Mar-Jun, Dec-Feb" },
            { name: "Bali", type: "international", minBudget: 30000, bestFor: ["beach", "culture", "adventure", "relaxation"], rating: 4.8, bestSeason: "Apr-Oct" },
            { name: "Bangkok", type: "international", minBudget: 25000, bestFor: ["food", "shopping", "nightlife", "culture"], rating: 4.6, bestSeason: "Nov-Feb" },
            { name: "Singapore", type: "international", minBudget: 50000, bestFor: ["city", "food", "shopping", "family"], rating: 4.7, bestSeason: "Year-round" },
            { name: "Paris", type: "international", minBudget: 80000, bestFor: ["culture", "history", "romance", "food"], rating: 4.9, bestSeason: "Apr-Oct" },
            { name: "Dubai", type: "international", minBudget: 45000, bestFor: ["luxury", "shopping", "adventure", "city"], rating: 4.7, bestSeason: "Nov-Mar" },
        ];

        const interestList = interests.toLowerCase().split(",").map(s => s.trim());
        const perPersonBudget = budget / 1; // per person

        const filtered = allPlaces
            .filter(p => travelMode === "both" || p.type === travelMode)
            .filter(p => p.minBudget * days <= perPersonBudget * 1.5)
            .map(p => {
                const matchScore = interestList.filter(i => p.bestFor.some(b => b.includes(i))).length;
                return { ...p, matchScore, estimatedTotalCost: `₹${(p.minBudget * days).toLocaleString()} - ₹${(p.minBudget * days * 2).toLocaleString()}` };
            })
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);

        return JSON.stringify({ recommendations: filtered, budget, days, interests, travelMode });
    },
    {
        name: "recommend_places",
        description: "Recommend travel destinations based on budget, number of days, interests, and whether domestic or international travel is preferred.",
        schema: z.object({
            budget: z.number().describe("Total budget in INR"),
            days: z.number().describe("Number of days available"),
            interests: z.string().describe("Comma-separated interests like beach, culture, adventure, food"),
            travelMode: z.enum(["domestic", "international", "both"]).describe("Travel mode preference"),
        }),
    }
);

const estimateStayCost = tool(
    async ({ destination, nights, budgetTier, guests }) => {
        const stayRates = {
            budget: { hostel: 400, budgetHotel: 800, guesthouse: 600 },
            standard: { hotel3Star: 2500, hotel4Star: 4000, serviceApartment: 3000 },
            luxury: { hotel5Star: 8000, premiumResort: 15000, boutiqueHotel: 6000 },
        };

        const rates = stayRates[budgetTier] || stayRates.standard;
        const options = Object.entries(rates).map(([type, rate]) => ({
            type: type.replace(/([A-Z])/g, ' $1').trim(),
            perNight: rate,
            totalCost: rate * nights,
            forGroup: rate * nights * Math.ceil(guests / 2),
        }));

        return JSON.stringify({ destination, nights, budgetTier, guests, stayOptions: options, currency: "INR" });
    },
    {
        name: "estimate_stay_cost",
        description: "Estimate accommodation/stay costs for a destination based on number of nights, budget tier, and number of guests.",
        schema: z.object({
            destination: z.string().describe("Destination city"),
            nights: z.number().describe("Number of nights"),
            budgetTier: z.enum(["budget", "standard", "luxury"]).describe("Budget tier"),
            guests: z.number().describe("Number of guests"),
        }),
    }
);

const estimateTransportCost = tool(
    async ({ source, destination, travelMode, groupSize }) => {
        const domesticEstimates = {
            flight: { min: 3000, max: 8000, duration: "1-3 hours" },
            train: { min: 500, max: 3000, duration: "8-24 hours" },
            bus: { min: 400, max: 2000, duration: "6-20 hours" },
        };

        const internationalEstimates = {
            flight: { min: 15000, max: 60000, duration: "3-15 hours" },
        };

        const estimates = travelMode === "international" ? internationalEstimates : domesticEstimates;
        const options = Object.entries(estimates).map(([mode, est]) => ({
            mode,
            perPerson: { min: est.min, max: est.max },
            forGroup: { min: est.min * groupSize, max: est.max * groupSize },
            duration: est.duration,
        }));

        return JSON.stringify({ source, destination, travelMode, groupSize, transportOptions: options, currency: "INR" });
    },
    {
        name: "estimate_transport_cost",
        description: "Estimate intercity transport costs (flights, trains, buses) between source and destination for a group.",
        schema: z.object({
            source: z.string().describe("Source city"),
            destination: z.string().describe("Destination city"),
            travelMode: z.enum(["domestic", "international"]).describe("Travel mode"),
            groupSize: z.number().describe("Number of travelers"),
        }),
    }
);

// ── Tools array ───────────────────────────────────────────────

const tools = [calculateTripExpenses, generateItinerary, recommendPlaces, estimateStayCost, estimateTransportCost];

// ── LangGraph Agent ───────────────────────────────────────────

const SYSTEM_PROMPT = `You are WanderWallet AI — an expert travel budget planner and trip advisor specializing in Indian travel. You help users plan trips with detailed budgets in Indian Rupees (₹).

Your capabilities:
1. **Trip Expense Calculation** — Calculate total trip costs with detailed breakdowns
2. **Itinerary Generation** — Create day-by-day travel plans with activities and timings
3. **Destination Recommendations** — Suggest places based on budget, interests, and timeline
4. **Stay Cost Estimation** — Compare accommodation options across budget tiers
5. **Transport Cost Estimation** — Estimate flights, trains, and bus costs

Guidelines:
- Always provide costs in Indian Rupees (₹)
- Be specific with numbers and estimates
- Suggest money-saving tips when appropriate
- Consider seasonal factors and best travel times
- Format responses with clear headings, bullet points, and tables when helpful
- If the user's query is vague, ask clarifying questions about budget, dates, group size, and interests
- Be friendly, enthusiastic, and helpful — you love travel planning!

When creating a complete trip plan, use multiple tools to give comprehensive information covering transport, stay, activities, food, and total expenses.`;

export async function createTripPlannerAgent() {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return null;
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        apiKey,
        temperature: 0.7,
        maxOutputTokens: 4096,
    });

    const modelWithTools = model.bindTools(tools);

    // Define the state
    const AgentState = Annotation.Root({
        messages: Annotation({
            reducer: (x, y) => x.concat(y),
        }),
    });

    // Should we continue or end?
    function shouldContinue(state) {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage?.tool_calls?.length > 0) {
            return "tools";
        }
        return END;
    }

    // Call the model
    async function callModel(state) {
        const response = await modelWithTools.invoke(state.messages);
        return { messages: [response] };
    }

    const toolNode = new ToolNode(tools);

    // Build the graph
    const workflow = new StateGraph(AgentState)
        .addNode("agent", callModel)
        .addNode("tools", toolNode)
        .addEdge(START, "agent")
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent");

    const app = workflow.compile();

    return app;
}

export { SYSTEM_PROMPT, HumanMessage, SystemMessage, AIMessage };
