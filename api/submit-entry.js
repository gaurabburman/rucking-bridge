const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
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
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 🛡️ DATA NORMALIZATION (17th April Format)
        const finalData = {
            operator_uid: uid,
            operator_email: email,
            name: ruckingData.operatorName,
            age: ruckingData.age,
            country: ruckingData.country,
            gender: ruckingData.gender,
            ruckWeight: parseFloat(ruckingData.loadWeight), // Strictly Number
            pace: ruckingData.pace,
            unit: ruckingData.loadWeightUnit,
            calories: parseInt(ruckingData.caloriesBurned), // Strictly Number
            volume: parseFloat(ruckingData.volumeMoved),   // Strictly Number
            timestamp: new Date()
        };

        // Save to Personal Logs
        await db.collection('personal_logs').insertOne(finalData);

        // Save to Live Leaderboard
        await db.collection('live_leaderboard').insertOne(finalData);

        await client.close();
        return res.status(200).json({ success: true, message: 'MISSION SUCCESS: Data Locked!' });

    } catch (error) {
        return res.status(200).json({ success: false, error: 'BACKEND_ERROR: ' + error.message });
    }
};
