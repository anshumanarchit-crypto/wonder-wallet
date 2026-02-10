import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    source: {
        type: String,
        required: [true, 'Source city is required'],
        trim: true,
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true,
    },
    budget: {
        type: Number,
        required: [true, 'Budget is required'],
        min: 0,
    },
    days: {
        type: Number,
        required: [true, 'Number of days is required'],
        min: 1,
        max: 60,
    },
    groupSize: {
        type: Number,
        default: 1,
        min: 1,
    },
    travelMode: {
        type: String,
        enum: ['domestic', 'international'],
        default: 'domestic',
    },
    transportPreference: {
        type: String,
        enum: ['flight', 'train', 'bus', 'mixed', 'flightOnly', 'flightWithLocal'],
        default: 'mixed',
    },
    spendingPriority: {
        type: String,
        enum: ['accommodation', 'food', 'activities', 'balanced'],
        default: 'balanced',
    },
    status: {
        type: String,
        enum: ['planned', 'ongoing', 'completed', 'cancelled'],
        default: 'planned',
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    notes: {
        type: String,
        maxlength: 1000,
        default: '',
    },
}, {
    timestamps: true,
});

// Index for fast user-based queries
tripSchema.index({ userId: 1, createdAt: -1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
