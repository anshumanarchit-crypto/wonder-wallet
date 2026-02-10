import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const destination = (req.query.destination || "Delhi").trim();
    const normalizedDestination = destination.charAt(0).toUpperCase() + destination.slice(1).toLowerCase();
    const budget = Number(req.query.budget) || 50000;
    const days = Number(req.query.days) || 5;

    const attractions = getAttractionsByDestination(normalizedDestination, budget, days);

    res.json({
        status: "success",
        destination: normalizedDestination,
        attractions,
        totalAttractions: attractions.length,
    });
});

function getAttractionsByDestination(destination, budget, days) {
    const attractionsMap = {
        Delhi: [
            { id: 1, name: "Red Fort", category: "Historical Monument", description: "UNESCO World Heritage Site, 16th century Mughal fortress with stunning architecture", entryFee: 250, timeRequired: "3 hours", rating: 4.6, image: "/attractions/red-fort.jpg", bestTime: "Early morning", tags: ["monument", "history", "photography"] },
            { id: 2, name: "India Gate", category: "Landmark", description: "Iconic war memorial and popular hangout spot with shops and restaurants nearby", entryFee: 0, timeRequired: "1 hour", rating: 4.5, image: "/attractions/india-gate.jpg", bestTime: "Evening", tags: ["landmark", "photography", "relaxation"] },
            { id: 3, name: "Jama Masjid", category: "Religious Site", description: "One of India's largest mosques with breathtaking Mughal architecture and panoramic views", entryFee: 100, timeRequired: "2 hours", rating: 4.4, image: "/attractions/jama-masjid.jpg", bestTime: "Morning", tags: ["religious", "architecture", "culture"] },
            { id: 4, name: "Chandni Chowk Market", category: "Market & Food", description: "Bustling bazaar with street food, traditional shops, and chaotic energy of Old Delhi", entryFee: 0, timeRequired: "2-3 hours", rating: 4.3, image: "/attractions/chandni-chowk.jpg", bestTime: "Morning or evening", tags: ["street-food", "shopping", "culture"] },
            { id: 5, name: "Qutub Minar", category: "Historical Monument", description: "Tallest brick minaret in the world with intricate carvings and UNESCO heritage status", entryFee: 500, timeRequired: "2 hours", rating: 4.5, image: "/attractions/qutub-minar.jpg", bestTime: "Late afternoon", tags: ["monument", "history", "architecture"] },
            { id: 6, name: "Adventure Sports Park", category: "Adventure", description: "Zip-lining, rock climbing, and obstacle courses for thrill-seekers", entryFee: 1500, timeRequired: "3-4 hours", rating: 4.2, image: "/attractions/adventure-park.jpg", bestTime: "Any time", tags: ["adventure", "thrill", "sports"] },
        ],
        Mumbai: [
            { id: 1, name: "Gateway of India", category: "Landmark", description: "Iconic monument overlooking the Arabian Sea, perfect for sunset views and photography", entryFee: 0, timeRequired: "1.5 hours", rating: 4.5, image: "/attractions/gateway-india.jpg", bestTime: "Sunset", tags: ["landmark", "photography", "monument"] },
            { id: 2, name: "Marine Drive", category: "Beach & Scenic", description: "Scenic beachfront boulevard with stunning city skyline views, perfect for evening walks", entryFee: 0, timeRequired: "2 hours", rating: 4.6, image: "/attractions/marine-drive.jpg", bestTime: "Evening", tags: ["beach", "scenic", "relaxation"] },
            { id: 3, name: "Colaba Causeway", category: "Shopping & Food", description: "Trendy promenade with street food, shopping, and vibrant nightlife", entryFee: 0, timeRequired: "2-3 hours", rating: 4.4, image: "/attractions/colaba-causeway.jpg", bestTime: "Evening", tags: ["shopping", "street-food", "nightlife"] },
            { id: 4, name: "Elephant Island Caves", category: "Historical Caves", description: "Ancient rock-cut Buddhist caves with intricate stone carvings and harbor views", entryFee: 250, timeRequired: "3-4 hours", rating: 4.3, image: "/attractions/elephant-island.jpg", bestTime: "Morning", tags: ["history", "culture", "cave-exploration"] },
            { id: 5, name: "Bandra Beach", category: "Beach", description: "Pristine beach perfect for swimming, sunbathing, and water sports", entryFee: 0, timeRequired: "2-3 hours", rating: 4.4, image: "/attractions/bandra-beach.jpg", bestTime: "Early morning or evening", tags: ["beach", "swimming", "sports"] },
            { id: 6, name: "Paragliding Adventure", category: "Adventure", description: "Thrilling paragliding experience with bird's eye views of the coastline", entryFee: 3000, timeRequired: "2-3 hours", rating: 4.7, image: "/attractions/paragliding.jpg", bestTime: "Morning", tags: ["adventure", "thrill", "aerial-sports"] },
        ],
        Bangkok: [
            { id: 1, name: "Grand Palace", category: "Palace", description: "Spectacular royal palace with golden spires, intricate mosaics, and Temple of the Emerald Buddha", entryFee: 500, timeRequired: "2-3 hours", rating: 4.6, image: "/attractions/grand-palace.jpg", bestTime: "Early morning", tags: ["palace", "temple", "culture"] },
            { id: 2, name: "Floating Markets", category: "Market", description: "Traditional waterside markets selling fresh produce, souvenirs, and local crafts", entryFee: 200, timeRequired: "3-4 hours", rating: 4.5, image: "/attractions/floating-markets.jpg", bestTime: "Morning", tags: ["market", "culture", "shopping"] },
            { id: 3, name: "Muay Thai Fight", category: "Adventure", description: "Experience traditional Thai boxing matches with authentic fighting techniques", entryFee: 1000, timeRequired: "2-3 hours", rating: 4.4, image: "/attractions/muay-thai.jpg", bestTime: "Evening", tags: ["sports", "culture", "adventure"] },
            { id: 4, name: "Chao Phraya River Cruise", category: "Scenic Boat Tour", description: "Romantic sunset cruise along Bangkok's iconic river with temple views", entryFee: 800, timeRequired: "2 hours", rating: 4.5, image: "/attractions/river-cruise.jpg", bestTime: "Sunset", tags: ["scenic", "river", "romantic"] },
            { id: 5, name: "Street Food Tour", category: "Food Experience", description: "Guided tour of Bangkok's vibrant street food scene with tastings and local insights", entryFee: 600, timeRequired: "3 hours", rating: 4.7, image: "/attractions/street-food.jpg", bestTime: "Evening", tags: ["food", "culture", "experience"] },
            { id: 6, name: "Zip-lining in Rainforest", category: "Adventure", description: "Thrilling canopy adventure through lush tropical forests near Bangkok", entryFee: 2500, timeRequired: "4 hours", rating: 4.6, image: "/attractions/zip-line.jpg", bestTime: "Morning", tags: ["adventure", "nature", "thrill"] },
        ],
        Paris: [
            { id: 1, name: "Eiffel Tower", category: "Monument", description: "Iconic iron lattice tower offering breathtaking views of Paris from the top", entryFee: 2500, timeRequired: "2-3 hours", rating: 4.7, image: "/attractions/eiffel-tower.jpg", bestTime: "Late afternoon or evening", tags: ["monument", "photography", "iconic"] },
            { id: 2, name: "Louvre Museum", category: "Museum", description: "World's largest art museum housing the Mona Lisa and thousands of masterpieces", entryFee: 1700, timeRequired: "3-4 hours", rating: 4.6, image: "/attractions/louvre.jpg", bestTime: "Early morning", tags: ["museum", "art", "culture"] },
            { id: 3, name: "Notre-Dame Cathedral", category: "Religious Monument", description: "Stunning Gothic cathedral with intricate architecture and rich history", entryFee: 800, timeRequired: "1.5 hours", rating: 4.5, image: "/attractions/notre-dame.jpg", bestTime: "Morning", tags: ["cathedral", "architecture", "history"] },
            { id: 4, name: "Montmartre District", category: "Neighborhood", description: "Charming hilltop district with art galleries, cafes, and Sacré-Cœur basilica", entryFee: 300, timeRequired: "2-3 hours", rating: 4.5, image: "/attractions/montmartre.jpg", bestTime: "Morning or evening", tags: ["culture", "art", "local"] },
            { id: 5, name: "Seine River Cruise", category: "Boat Tour", description: "Scenic boat tour through Paris seeing landmarks illuminated at night", entryFee: 1400, timeRequired: "1-2 hours", rating: 4.4, image: "/attractions/seine-cruise.jpg", bestTime: "Evening", tags: ["river", "scenic", "romantic"] },
            { id: 6, name: "Hot Air Balloon Ride", category: "Adventure", description: "Magical sunrise hot air balloon ride over the Paris countryside", entryFee: 25000, timeRequired: "3 hours", rating: 4.8, image: "/attractions/hot-air-balloon.jpg", bestTime: "Early morning", tags: ["adventure", "romantic", "scenic"] },
        ],
        Goa: [
            { id: 1, name: "Baga Beach", category: "Beach", description: "Popular beach with water sports, shacks, and vibrant nightlife along the Goa coast", entryFee: 0, timeRequired: "3-4 hours", rating: 4.5, image: "/attractions/baga-beach.jpg", bestTime: "Morning or evening", tags: ["beach", "swimming", "water-sports"] },
            { id: 2, name: "Fort Aguada", category: "Historical Monument", description: "17th-century Portuguese fort with panoramic sea views and historic cannon installations", entryFee: 100, timeRequired: "2 hours", rating: 4.4, image: "/attractions/fort-aguada.jpg", bestTime: "Late afternoon", tags: ["history", "architecture", "fort"] },
            { id: 3, name: "Palolem Beach", category: "Beach", description: "Serene crescent beach in South Goa with rocky outcrops and peaceful ambiance", entryFee: 0, timeRequired: "2-3 hours", rating: 4.6, image: "/attractions/palolem-beach.jpg", bestTime: "Sunset", tags: ["beach", "peaceful", "scenic"] },
            { id: 4, name: "Dudhsagar Waterfall Trek", category: "Adventure", description: "Stunning 600-meter waterfall surrounded by lush forests, accessible via jungle trek", entryFee: 500, timeRequired: "4-5 hours", rating: 4.7, image: "/attractions/dudhsagar.jpg", bestTime: "Monsoon season", tags: ["adventure", "trekking", "nature"] },
            { id: 5, name: "Basilica of Bom Jesus", category: "Religious Site", description: "UNESCO World Heritage baroque church with ornate interior and historic significance", entryFee: 0, timeRequired: "1.5 hours", rating: 4.5, image: "/attractions/basilica.jpg", bestTime: "Morning", tags: ["religious", "architecture", "culture"] },
            { id: 6, name: "Scuba Diving Experience", category: "Adventure", description: "Explore vibrant coral reefs and marine life with professional diving instructors", entryFee: 2000, timeRequired: "3-4 hours", rating: 4.6, image: "/attractions/scuba.jpg", bestTime: "Any time", tags: ["adventure", "water-sports", "marine"] },
        ],
        Bangalore: [
            { id: 1, name: "Vidhana Soudha", category: "Historical Monument", description: "Grand neo-Dravidian architecture government building, iconic symbol of Bangalore", entryFee: 0, timeRequired: "1-2 hours", rating: 4.4, image: "/attractions/vidhana-soudha.jpg", bestTime: "Morning", tags: ["history", "architecture", "government"] },
            { id: 2, name: "Nandi Hills", category: "Hill Station", description: "Scenic hill station with panoramic views, ancient temples, and trekking trails", entryFee: 50, timeRequired: "4-5 hours", rating: 4.6, image: "/attractions/nandi-hills.jpg", bestTime: "Early morning", tags: ["nature", "trekking", "hills"] },
            { id: 3, name: "Ulsoor Lake", category: "Lake & Recreation", description: "Urban lake with boating facilities, parks, and scenic walking paths", entryFee: 0, timeRequired: "2-3 hours", rating: 4.3, image: "/attractions/ulsoor-lake.jpg", bestTime: "Evening", tags: ["lake", "recreation", "peaceful"] },
            { id: 4, name: "Bangalore Palace", category: "Palace", description: "Victorian palace with ornate architecture and lush gardens, occasionally open for tours", entryFee: 600, timeRequired: "2-3 hours", rating: 4.4, image: "/attractions/bangalore-palace.jpg", bestTime: "Any time", tags: ["palace", "history", "architecture"] },
            { id: 5, name: "Lalbagh Botanical Garden", category: "Park & Garden", description: "Historic botanical garden with diverse plant species, glass house, and peaceful ambiance", entryFee: 20, timeRequired: "2-3 hours", rating: 4.5, image: "/attractions/lalbagh.jpg", bestTime: "Morning", tags: ["garden", "nature", "photography"] },
            { id: 6, name: "Rock Climbing", category: "Adventure", description: "Indoor and outdoor rock climbing experiences with professional trainers", entryFee: 1000, timeRequired: "2-3 hours", rating: 4.5, image: "/attractions/rock-climbing.jpg", bestTime: "Any time", tags: ["adventure", "sports", "thrill"] },
        ],
        Bali: [
            { id: 1, name: "Tanah Lot Temple", category: "Religious Site", description: "Ancient Hindu shrine perched on a rock formation in the sea, spectacular sunset views", entryFee: 600, timeRequired: "2-3 hours", rating: 4.7, image: "/attractions/tanah-lot.jpg", bestTime: "Sunset", tags: ["temple", "scenic", "photography"] },
            { id: 2, name: "Ubud Monkey Forest", category: "Nature & Wildlife", description: "Sacred forest sanctuary with hundreds of playful monkeys and ancient temple ruins", entryFee: 700, timeRequired: "2-3 hours", rating: 4.5, image: "/attractions/monkey-forest.jpg", bestTime: "Morning", tags: ["nature", "wildlife", "temple"] },
            { id: 3, name: "Tegalalang Rice Terraces", category: "Scenic Landscape", description: "UNESCO-listed emerald rice terraces with stunning valley views and photo opportunities", entryFee: 150, timeRequired: "2 hours", rating: 4.6, image: "/attractions/rice-terraces.jpg", bestTime: "Early morning", tags: ["scenic", "photography", "nature"] },
            { id: 4, name: "Water Palace (Tirta Gangga)", category: "Historical Site", description: "Former royal palace with ornate pools, fountains, and lush tropical gardens", entryFee: 500, timeRequired: "2 hours", rating: 4.5, image: "/attractions/water-palace.jpg", bestTime: "Any time", tags: ["palace", "gardens", "culture"] },
            { id: 5, name: "Mount Batur Sunrise Trek", category: "Adventure", description: "Pre-dawn volcano trek rewarded with breathtaking sunrise views over Bali", entryFee: 4500, timeRequired: "6-7 hours", rating: 4.8, image: "/attractions/mount-batur.jpg", bestTime: "Pre-dawn start", tags: ["adventure", "trekking", "sunrise"] },
            { id: 6, name: "Seminyak Beach", category: "Beach", description: "Trendy beach with beach clubs, surfing, and vibrant sunset celebrations", entryFee: 0, timeRequired: "3-4 hours", rating: 4.4, image: "/attractions/seminyak-beach.jpg", bestTime: "Afternoon or sunset", tags: ["beach", "surfing", "sunset"] },
            { id: 7, name: "Uluwatu Temple & Kecak Dance", category: "Cultural Experience", description: "Clifftop temple with traditional Balinese fire dance performance at sunset", entryFee: 1200, timeRequired: "3 hours", rating: 4.7, image: "/attractions/uluwatu.jpg", bestTime: "Sunset", tags: ["temple", "culture", "performance"] },
            { id: 8, name: "White Water Rafting", category: "Adventure", description: "Thrilling rafting adventure through jungle rapids and scenic gorges", entryFee: 3500, timeRequired: "4-5 hours", rating: 4.6, image: "/attractions/rafting.jpg", bestTime: "Morning", tags: ["adventure", "water-sports", "nature"] },
        ],
        Singapore: [
            { id: 1, name: "Gardens by the Bay", category: "Park & Gardens", description: "Futuristic gardens with iconic Supertrees, Cloud Forest dome, and stunning light shows", entryFee: 2000, timeRequired: "3-4 hours", rating: 4.8, image: "/attractions/gardens-by-bay.jpg", bestTime: "Evening for light show", tags: ["garden", "architecture", "photography"] },
            { id: 2, name: "Marina Bay Sands SkyPark", category: "Observation Deck", description: "Rooftop observation deck with 360° views of Singapore's skyline and harbor", entryFee: 2500, timeRequired: "1-2 hours", rating: 4.7, image: "/attractions/marina-bay.jpg", bestTime: "Sunset or evening", tags: ["skyline", "observation", "photography"] },
            { id: 3, name: "Sentosa Island", category: "Theme Park & Beach", description: "Resort island with Universal Studios, beaches, aquarium, and adventure activities", entryFee: 3500, timeRequired: "Full day", rating: 4.6, image: "/attractions/sentosa.jpg", bestTime: "Any time", tags: ["theme-park", "beach", "family"] },
            { id: 4, name: "Chinatown Heritage Centre", category: "Cultural Museum", description: "Interactive museum showcasing Singapore's Chinese immigrant history and culture", entryFee: 1300, timeRequired: "2 hours", rating: 4.4, image: "/attractions/chinatown.jpg", bestTime: "Any time", tags: ["museum", "culture", "history"] },
            { id: 5, name: "Singapore Zoo & Night Safari", category: "Zoo & Wildlife", description: "World-renowned open-concept zoo with nocturnal wildlife experience", entryFee: 3000, timeRequired: "5-6 hours", rating: 4.7, image: "/attractions/zoo.jpg", bestTime: "Day and night", tags: ["wildlife", "family", "nature"] },
            { id: 6, name: "Merlion Park", category: "Landmark", description: "Iconic Singapore symbol fountain with harbor views and city skyline backdrop", entryFee: 0, timeRequired: "1 hour", rating: 4.3, image: "/attractions/merlion.jpg", bestTime: "Evening", tags: ["landmark", "photography", "iconic"] },
            { id: 7, name: "Clarke Quay River Cruise", category: "Boat Tour", description: "Scenic river cruise through Singapore's historic and modern districts", entryFee: 1800, timeRequired: "1-2 hours", rating: 4.5, image: "/attractions/river-cruise.jpg", bestTime: "Evening", tags: ["cruise", "scenic", "romantic"] },
            { id: 8, name: "iFly Singapore Indoor Skydiving", category: "Adventure", description: "Experience the thrill of skydiving in a safe indoor wind tunnel environment", entryFee: 8000, timeRequired: "2 hours", rating: 4.6, image: "/attractions/ifly.jpg", bestTime: "Any time", tags: ["adventure", "thrill", "unique"] },
        ],
    };

    if (attractionsMap[destination]) {
        return attractionsMap[destination];
    }

    const key = Object.keys(attractionsMap).find((k) => k.toLowerCase() === destination.toLowerCase());
    if (key) {
        return attractionsMap[key];
    }

    return attractionsMap["Delhi"];
}

export default router;
