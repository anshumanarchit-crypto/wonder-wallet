import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const budget = req.query.budget;

    const recommendations = {
        budget: {
            name: "Budget",
            icon: "💰",
            totalBudget: 2000,
            breakdown: {
                flights: 700,
                accommodation: 600,
                food: 400,
                activities: 200,
                miscellaneous: 100,
            },
            features: ["Hostels & budget hotels", "Street food & local eateries", "Free activities", "Public transport"],
            averageRating: 4.5,
        },
        standard: {
            name: "Standard",
            icon: "✈️",
            totalBudget: 5000,
            breakdown: {
                flights: 1750,
                accommodation: 1500,
                food: 1000,
                activities: 500,
                miscellaneous: 250,
            },
            features: ["3-4 star hotels", "Mix of restaurants", "Paid tours", "Taxis & rentals"],
            averageRating: 4.8,
        },
        luxury: {
            name: "Luxury",
            icon: "👑",
            totalBudget: 10000,
            breakdown: {
                flights: 3500,
                accommodation: 3000,
                food: 2000,
                activities: 1000,
                miscellaneous: 500,
            },
            features: ["5-star hotels", "Fine dining", "VIP tours", "Private transport"],
            averageRating: 4.9,
        },
    };

    const selected = budget ? recommendations[budget] : Object.values(recommendations);

    res.json({
        status: "success",
        data: selected,
        timestamp: new Date().toISOString(),
    });
});

export default router;
