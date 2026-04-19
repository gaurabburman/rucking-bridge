const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 🛡️ 1. CORS SHIELD
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // 🛡️ 2. FIREBASE ADMIN INIT
        if (!admin.apps.length) {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
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

        const { idToken, ruckingData } = req.body;
        if (!idToken) throw new Error("Operator identity not found.");

        // 🛡️ 3. IDENTITY VERIFICATION
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // 🛡️ 4. MONGODB VAULT CONNECTION
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 🛡️ 5. DATA INGESTION (Every Single Value)
        const fullPayload = {
            operator_uid: uid,
            operator_email: email,
            ...ruckingData, // Yeh line har ek field ko automatically copy kar degi
            processedAt: new Date()
        };

        // ACTION A: Full Log for Personal Dashboard
        await db.collection('personal_logs').insertOne(fullPayload);

        // ACTION B: Filtered Log for Live Leaderboard
        const leaderboardEntry = {
            name: ruckingData.operatorName,
            country: ruckingData.country,
            calories: ruckingData.caloriesBurned,
            volume: ruckingData.volumeMoved,
            pace: ruckingData.pace,
            load: ruckingData.loadWeight + " " + ruckingData.loadWeightUnit,
            timestamp: new Date()
        };
        await db.collection('live_leaderboard').insertOne(leaderboardEntry);

        await client.close();

        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Full Tactical Packet Locked!' 
        });

    } catch (error) {
        return res.status(200).json({ success: false, error: 'BACKEND_ERROR: ' + error.message });
    }
};
