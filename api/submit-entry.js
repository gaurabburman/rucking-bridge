const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

// 1. Initialize Firebase Admin (Using Vercel Environment Variables)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Vercel handles the \n in environment variables differently sometimes
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // Standard CORS Headers for WordPress Integration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Tactical Error: Only POST strikes allowed.' });
    }

    try {
        const { idToken, ruckingData } = req.body;

        if (!idToken) {
            return res.status(401).json({ error: 'Access Denied: No Firebase Token found.' });
        }

        // 2. Verify Identity with Firebase Bunker
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // 3. Establish Connection to MongoDB Vault
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // Prepare the Tactical Log Entry
        const logEntry = {
            operator_uid: uid,
            operator_email: email,
            data: ruckingData,
            timestamp: new Date()
        };

        // 4. Double-Strike Insertion
        // A) Personal Vault
        await db.collection('personal_logs').insertOne(logEntry);
        
        // B) Community Leaderboard (Optional: hum isse Leaderboard ko filter bhi kar sakte hain)
        await db.collection('live_leaderboard').insertOne({
            name: ruckingData.operatorName || 'Anonymous Operator',
            calories: ruckingData.caloriesBurned,
            volume: ruckingData.volumeMoved,
            timestamp: new Date()
        });

        res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Data Locked in Bunker! 💥',
            identity: email 
        });

    } catch (error) {
        console.error('Bunker Breach Error:', error);
        res.status(500).json({ error: 'Strike Failed: ' + error.message });
    } finally {
        await client.close();
    }
};
