import { Router } from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/expenses — list expenses (optionally filter by tripId)
router.get('/', auth, async (req, res) => {
    try {
        const { tripId, category } = req.query;
        const filter = { userId: req.userId };
        if (tripId) filter.tripId = tripId;
        if (category) filter.category = category;

        const expenses = await Expense.find(filter)
            .sort({ date: -1 })
            .populate('tripId', 'source destination')
            .lean();

        res.json({
            status: 'success',
            count: expenses.length,
            data: expenses,
        });
    } catch (error) {
        console.error('List expenses error:', error);
        res.status(500).json({ error: 'Failed to fetch expenses.' });
    }
});

// GET /api/expenses/summary — category-wise summary for a trip
router.get('/summary', auth, async (req, res) => {
    try {
        const { tripId } = req.query;
        if (!tripId) {
            return res.status(400).json({ error: 'tripId query parameter is required.' });
        }

        const summary = await Expense.aggregate([
            { $match: { userId: req.userId, tripId: new mongoose.Types.ObjectId(tripId) } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
        ]);

        const totalSpent = summary.reduce((sum, cat) => sum + cat.total, 0);

        res.json({
            status: 'success',
            tripId,
            totalSpent,
            categories: summary.map((s) => ({
                category: s._id,
                total: s.total,
                count: s.count,
                percentage: totalSpent > 0 ? Math.round((s.total / totalSpent) * 100) : 0,
            })),
        });
    } catch (error) {
        console.error('Expense summary error:', error);
        res.status(500).json({ error: 'Failed to get expense summary.' });
    }
});

// POST /api/expenses — add expense
router.post('/', auth, async (req, res) => {
    try {
        const { tripId, category, amount, currency, description, date } = req.body;

        if (!tripId || !category || !amount || !description) {
            return res.status(400).json({ error: 'tripId, category, amount, and description are required.' });
        }

        const expense = new Expense({
            userId: req.userId,
            tripId, category, amount,
            currency: currency || 'INR',
            description, date: date || new Date(),
        });

        await expense.save();

        res.status(201).json({
            status: 'success',
            message: 'Expense added successfully',
            data: expense,
        });
    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ error: 'Failed to add expense.' });
    }
});

// PUT /api/expenses/:id — update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found.' });
        }

        res.json({
            status: 'success',
            message: 'Expense updated successfully',
            data: expense,
        });
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ error: 'Failed to update expense.' });
    }
});

// DELETE /api/expenses/:id — delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found.' });
        }

        res.json({
            status: 'success',
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ error: 'Failed to delete expense.' });
    }
});

export default router;
