import { Router } from 'express';
import User from '../models/User.js';
import admin from '../config/firebase-admin.js';

const router = Router();

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Sync User (Create/Update in MongoDB after Firebase Login)
router.post('/sync', verifyToken, async (req, res) => {
    try {
        const { uid, email, name, picture, email_verified } = req.user;
        const { mobile } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user
            if (!user.googleId) user.googleId = uid;
            if (!user.avatar && picture) user.avatar = picture;
            if (email_verified && !user.isVerified) user.isVerified = true;
            if (mobile && !user.mobile) user.mobile = mobile;
        } else {
            // Create new user
            user = new User({
                name: name || email.split('@')[0],
                email,
                googleId: uid,
                avatar: picture || '',
                isVerified: email_verified || false,
                mobile: mobile || '',
                authProvider: 'firebase' // We'll need to update User schema enum or just accept string
            });
        }

        await user.save();

        res.json({
            status: 'success',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified,
                mobile: user.mobile
            }
        });

    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Current User
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            status: 'success',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
