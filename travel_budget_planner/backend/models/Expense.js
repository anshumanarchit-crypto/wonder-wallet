import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    category: {
        type: String,
        enum: ['transport', 'accommodation', 'food', 'activities', 'shopping', 'miscellaneous'],
        required: [true, 'Category is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0,
    },
    currency: {
        type: String,
        default: 'INR',
        uppercase: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: 200,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Indexes for fast querying
expenseSchema.index({ userId: 1, tripId: 1 });
expenseSchema.index({ tripId: 1, category: 1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
