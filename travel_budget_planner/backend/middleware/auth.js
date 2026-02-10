import admin from '../config/firebase-admin.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token, authorization denied' });
        }

        try {
            // Verify Firebase ID Token
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Attach user info to request
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name || '',
                picture: decodedToken.picture || '',
                email_verified: decodedToken.email_verified
            };

            next();

        } catch (error) {
            console.error('Token verification failed:', error.code, error.message);
            // Handle token expired specifically?
            if (error.code === 'auth/id-token-expired') {
                return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
            }
            return res.status(401).json({ error: 'Token is not valid' });
        }

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export default auth;
