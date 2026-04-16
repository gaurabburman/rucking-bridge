const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 🛡️ 1. ARMOR UP: Always set CORS headers FIRST to prevent "Failed to fetch"
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle Preflight Request from Browser
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Tactical Error: Only POST strikes allowed.' });
    }

    try {
        // 🛡️ 2. CHECK ENVIRONMENT VARIABLES (To prevent silent crashes)
        if (!process.env.FIREBASE_PRIVATE_KEY) {
            throw new Error("CRITICAL: FIREBASE_PRIVATE_KEY is missing in Vercel.");
        }
        if (!process.env.MONGODB_URI) {
            throw new Error("CRITICAL: MONGODB_URI is missing in Vercel.");
        }

        // 🛡️ 3. SAFE FIREBASE INITIALIZATION
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
        }

        const { idToken, ruckingData } = req.body;

        if (!idToken) {
            return res.status(401).json({ error: 'Access Denied: No Firebase Token found.' });
        }

        // 🛡️ 4. VERIFY FIREBASE TOKEN
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // 🛡️ 5. CONNECT TO MONGODB
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        const logEntry = {
            operator_uid: uid,
            operator_email: email,
            data: ruckingData,
            timestamp: new Date()
        };

        // 🛡️ 6. THE DOUBLE STRIKE
        await db.collection('personal_logs').insertOne(logEntry);
        
        await db.collection('live_leaderboard').insertOne({
            name: ruckingData.operatorName || 'Anonymous Operator',
            calories: ruckingData.caloriesBurned,
            volume: ruckingData.volumeMoved,
            timestamp: new Date()
        });

        await client.close();

        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Data Locked in Bunker! 💥',
            identity: email 
        });

    } catch (error) {
        console.error('Bunker Breach Error:', error);
        // 🛡️ 7. GRACEFUL FALLBACK: Return exact error message to frontend
        return res.status(500).json({ success: false, error: 'Backend Error: ' + error.message });
    }
};
