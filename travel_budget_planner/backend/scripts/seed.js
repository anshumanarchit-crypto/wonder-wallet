import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_budget_planner';

const destinations = [
    { name: "Tokyo, Japan", continent: "Asia", country: "Japan", estimatedCost: 8500, currency: "JPY", exchangeRate: 149.5, attractions: 15, avgMealCost: 25, hotelCost: 180, popularityScore: 98 },
    { name: "Bali, Indonesia", continent: "Asia", country: "Indonesia", estimatedCost: 2800, currency: "IDR", exchangeRate: 15850, attractions: 25, avgMealCost: 5, hotelCost: 35, popularityScore: 94 },
    { name: "Paris, France", continent: "Europe", country: "France", estimatedCost: 7200, currency: "EUR", exchangeRate: 0.92, attractions: 20, avgMealCost: 30, hotelCost: 150, popularityScore: 99 },
    { name: "Bangkok, Thailand", continent: "Asia", country: "Thailand", estimatedCost: 1950, currency: "THB", exchangeRate: 35.2, attractions: 30, avgMealCost: 3, hotelCost: 20, popularityScore: 92 },
    { name: "New York, USA", continent: "North America", country: "USA", estimatedCost: 6500, currency: "USD", exchangeRate: 1, attractions: 40, avgMealCost: 28, hotelCost: 200, popularityScore: 97 },
    { name: "Buenos Aires, Argentina", continent: "South America", country: "Argentina", estimatedCost: 3200, currency: "ARS", exchangeRate: 1020, attractions: 22, avgMealCost: 12, hotelCost: 60, popularityScore: 88 },
    { name: "Dubai, UAE", continent: "Asia", country: "UAE", estimatedCost: 5500, currency: "AED", exchangeRate: 3.67, attractions: 18, avgMealCost: 20, hotelCost: 120, popularityScore: 95 },
    { name: "Singapore", continent: "Asia", country: "Singapore", estimatedCost: 4800, currency: "SGD", exchangeRate: 1.35, attractions: 22, avgMealCost: 15, hotelCost: 130, popularityScore: 93 },
    { name: "London, UK", continent: "Europe", country: "UK", estimatedCost: 8000, currency: "GBP", exchangeRate: 0.79, attractions: 35, avgMealCost: 25, hotelCost: 170, popularityScore: 96 },
    { name: "Barcelona, Spain", continent: "Europe", country: "Spain", estimatedCost: 5200, currency: "EUR", exchangeRate: 0.92, attractions: 24, avgMealCost: 18, hotelCost: 100, popularityScore: 91 },
    { name: "Sydney, Australia", continent: "Oceania", country: "Australia", estimatedCost: 7000, currency: "AUD", exchangeRate: 1.5, attractions: 20, avgMealCost: 22, hotelCost: 150, popularityScore: 90 },
    { name: "Cape Town, South Africa", continent: "Africa", country: "South Africa", estimatedCost: 3000, currency: "ZAR", exchangeRate: 18.5, attractions: 18, avgMealCost: 8, hotelCost: 50, popularityScore: 87 },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Import model after connection
        const { default: Destination } = await import('../models/Destination.js');

        const count = await Destination.countDocuments();
        if (count > 0) {
            console.log(`ℹ️  Database already has ${count} destinations. Skipping seed.`);
            console.log('   To re-seed, run: node scripts/seed.js --force');

            if (process.argv.includes('--force')) {
                await Destination.deleteMany({});
                console.log('🗑️  Cleared existing destinations.');
            } else {
                await mongoose.disconnect();
                process.exit(0);
            }
        }

        const result = await Destination.insertMany(destinations);
        console.log(`🌱 Seeded ${result.length} destinations successfully!`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seed();
