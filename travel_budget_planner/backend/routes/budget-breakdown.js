import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    const { totalBudget, tripDays, preferences } = req.body;

    const baseBreakdown = {
        flights: 0.35,
        accommodation: 0.3,
        food: 0.2,
        activities: 0.1,
        miscellaneous: 0.05,
    };

    let adjusted = baseBreakdown;
    if (preferences?.travelStyle) {
        if (preferences.travelStyle === "budget") {
            adjusted = {
                flights: 0.4,
                accommodation: 0.25,
                food: 0.15,
                activities: 0.12,
                miscellaneous: 0.08,
            };
        } else if (preferences.travelStyle === "luxury") {
            adjusted = {
                flights: 0.3,
                accommodation: 0.35,
                food: 0.25,
                activities: 0.15,
                miscellaneous: 0.05,
            };
        }
    }

    const breakdown = {
        flights: Math.round(totalBudget * adjusted.flights),
        accommodation: Math.round(totalBudget * adjusted.accommodation),
        food: Math.round(totalBudget * adjusted.food),
        activities: Math.round(totalBudget * adjusted.activities),
        miscellaneous: Math.round(totalBudget * adjusted.miscellaneous),
    };

    const dailyBudget = Math.round(totalBudget / tripDays);

    res.json({
        status: "success",
        data: {
            breakdown,
            dailyBudget,
            totalBudget,
            tripDays,
        },
        timestamp: new Date().toISOString(),
    });
});

export default router;
