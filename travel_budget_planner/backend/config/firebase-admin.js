import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin with credentials
// In production, use environment variables for the service account key
// For local dev, you can use a service account JSON file
// Or use default credentials if running on Google Cloud

// Check if we have the service account key in env
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    // Attempt default initialization (works if GOOGLE_APPLICATION_CREDENTIALS points to a file)
    // or if running in Cloud Functions / App Engine environment
    try {
        admin.initializeApp();
        console.log('Firebase Admin initialized with default credentials');
    } catch (error) {
        console.warn('Firebase Admin verification skipped: No credentials found. Setup is required for verified auth.');
    }
}

export default admin;
