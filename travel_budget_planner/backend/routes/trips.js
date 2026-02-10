import { Router } from 'express';
import Trip from '../models/Trip.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/trips — list user's trips
router.get('/', auth, async (req, res) => {
    try {
        const { status, sort = '-createdAt' } = req.query;
        const filter = { userId: req.userId };
        if (status) filter.status = status;

        const trips = await Trip.find(filter).sort(sort).lean();

        res.json({
            status: 'success',
            count: trips.length,
            data: trips,
        });
    } catch (error) {
        console.error('List trips error:', error);
        res.status(500).json({ error: 'Failed to fetch trips.' });
    }
});

// POST /api/trips — create a trip
router.post('/', auth, async (req, res) => {
    try {
        const {
            source, destination, budget, days, groupSize,
            travelMode, transportPreference, spendingPriority,
            startDate, endDate, notes,
        } = req.body;

        if (!source || !destination || !budget || !days) {
            return res.status(400).json({ error: 'Source, destination, budget, and days are required.' });
        }

        const trip = new Trip({
            userId: req.userId,
            source, destination, budget, days,
            groupSize: groupSize || 1,
            travelMode: travelMode || 'domestic',
            transportPreference: transportPreference || 'mixed',
            spendingPriority: spendingPriority || 'balanced',
            startDate, endDate, notes,
        });

        await trip.save();

        res.status(201).json({
            status: 'success',
            message: 'Trip created successfully',
            data: trip,
        });
    } catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({ error: 'Failed to create trip.' });
    }
});

// GET /api/trips/:id — get single trip
router.get('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId }).lean();

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found.' });
        }

        res.json({ status: 'success', data: trip });
    } catch (error) {
        console.error('Get trip error:', error);
        res.status(500).json({ error: 'Failed to fetch trip.' });
    }
});

// PUT /api/trips/:id — update trip
router.put('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found.' });
        }

        res.json({
            status: 'success',
            message: 'Trip updated successfully',
            data: trip,
        });
    } catch (error) {
        console.error('Update trip error:', error);
        res.status(500).json({ error: 'Failed to update trip.' });
    }
});

// DELETE /api/trips/:id — delete trip
router.delete('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found.' });
        }

        res.json({
            status: 'success',
            message: 'Trip deleted successfully',
        });
    } catch (error) {
        console.error('Delete trip error:', error);
        res.status(500).json({ error: 'Failed to delete trip.' });
    }
});

export default router;
