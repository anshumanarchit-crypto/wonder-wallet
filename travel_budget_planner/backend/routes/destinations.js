import { Router } from 'express';
import Destination from '../models/Destination.js';

const router = Router();

// Hardcoded fallback data (used if DB is empty)
const FALLBACK_DESTINATIONS = [
    { name: "Tokyo, Japan", continent: "Asia", country: "Japan", estimatedCost: 8500, currency: "JPY", exchangeRate: 149.5, attractions: 15, avgMealCost: 25, hotelCost: 180, popularityScore: 98 },
    { name: "Bali, Indonesia", continent: "Asia", country: "Indonesia", estimatedCost: 2800, currency: "IDR", exchangeRate: 15850, attractions: 25, avgMealCost: 5, hotelCost: 35, popularityScore: 94 },
    { name: "Paris, France", continent: "Europe", country: "France", estimatedCost: 7200, currency: "EUR", exchangeRate: 0.92, attractions: 20, avgMealCost: 30, hotelCost: 150, popularityScore: 99 },
    { name: "Bangkok, Thailand", continent: "Asia", country: "Thailand", estimatedCost: 1950, currency: "THB", exchangeRate: 35.2, attractions: 30, avgMealCost: 3, hotelCost: 20, popularityScore: 92 },
    { name: "New York, USA", continent: "North America", country: "USA", estimatedCost: 6500, currency: "USD", exchangeRate: 1, attractions: 40, avgMealCost: 28, hotelCost: 200, popularityScore: 97 },
    { name: "Buenos Aires, Argentina", continent: "South America", country: "Argentina", estimatedCost: 3200, currency: "ARS", exchangeRate: 1020, attractions: 22, avgMealCost: 12, hotelCost: 60, popularityScore: 88 },
];

// GET /api/destinations
router.get('/', async (req, res) => {
    try {
        const { continent } = req.query;
        const filter = continent ? { continent } : {};

        let destinations = await Destination.find(filter).sort({ popularityScore: -1 }).lean();

        // Fallback to hardcoded data if DB is empty
        if (destinations.length === 0) {
            destinations = continent
                ? FALLBACK_DESTINATIONS.filter((d) => d.continent === continent)
                : FALLBACK_DESTINATIONS;
        }

        res.json({
            status: 'success',
            data: destinations,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Destinations error:', error);
        // Return fallback on DB error
        res.json({
            status: 'success',
            data: FALLBACK_DESTINATIONS,
            timestamp: new Date().toISOString(),
        });
    }
});

// POST /api/destinations/seed — seed destinations into DB
router.post('/seed', async (req, res) => {
    try {
        const count = await Destination.countDocuments();
        if (count > 0) {
            return res.json({ status: 'success', message: `Database already has ${count} destinations.` });
        }

        await Destination.insertMany(FALLBACK_DESTINATIONS);
        res.json({ status: 'success', message: `Seeded ${FALLBACK_DESTINATIONS.length} destinations.` });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed destinations.' });
    }
});

export default router;
