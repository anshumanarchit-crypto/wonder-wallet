import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    continent: {
        type: String,
        required: true,
        enum: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'],
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    estimatedCost: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
    },
    exchangeRate: {
        type: Number,
        required: true,
    },
    attractions: {
        type: Number,
        default: 0,
    },
    avgMealCost: {
        type: Number,
        default: 0,
    },
    hotelCost: {
        type: Number,
        default: 0,
    },
    popularityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    image: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

destinationSchema.index({ continent: 1 });
destinationSchema.index({ popularityScore: -1 });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
