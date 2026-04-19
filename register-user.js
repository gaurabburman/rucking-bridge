const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. SHIELD UP: CORS FIRST
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 2. SAFE DEPENDENCY CHECK
        if (!admin.apps.length) {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
            // Clean up potential quotes from env variables
            if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                privateKey = privateKey.slice(1, -1);
            }
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                })
            });
        }

        const { idToken, profileData } = req.body;

        if (!idToken) {
            return res.status(200).json({ success: false, error: 'NO_TOKEN: Registration identity not found.' });
        }

        // 3. VERIFY IDENTITY
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 4. CONNECT TO MONGODB VAULT
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 5. ACTION: Save/Update User Profile (Including Mobile)
        const userEntry = {
            uid: uid,
            name: profileData.name,
            email: profileData.email,
            mobile: profileData.mobile, // Synchronizing Phone Number
            role: profileData.role || 'civilian-ops',
            status: 'active',
            registered_at: new Date() // Synchronizing Date and Time
        };

        // Update if exists (upsert)
        await db.collection('users').updateOne(
            { uid: uid },
            { $set: userEntry },
            { upsert: true }
        );

        await client.close();

        return res.status(200).json({
            success: true,
            message: 'MISSION SUCCESS: Operator Profile Secured in Bunker!'
        });

    } catch (error) {
        return res.status(200).json({ success: false, error: 'BACKEND_ERROR: ' + error.message });
    }
};
