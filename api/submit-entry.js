const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    [span_4](start_span)// 1. SHIELD UP: CORS & HEADERS[span_4](end_span)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    [span_5](start_span)if (req.method === 'OPTIONS') return res.status(200).end();[span_5](end_span)

    try {
        [span_6](start_span)// 2. SAFE FIREBASE INITIALIZATION[span_6](end_span)
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

        [span_7](start_span)// 3. VERIFY OPERATOR IDENTITY[span_7](end_span)
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        [span_8](start_span)// 4. CONNECT TO MONGODB VAULT[span_8](end_span)
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        [span_9](start_span)// 5. DATA NORMALIZATION (17th April Format)[span_9](end_span)
        const finalData = {
            operator_uid: uid,
            operator_email: email,
            name: ruckingData.operatorName,
            age: ruckingData.age,
            country: ruckingData.country,
            gender: ruckingData.gender,
            [span_10](start_span)ruckWeight: parseFloat(ruckingData.loadWeight), // Strictly Number[span_10](end_span)
            pace: ruckingData.pace,
            unit: ruckingData.loadWeightUnit,
            [span_11](start_span)calories: parseInt(ruckingData.caloriesBurned), // Strictly Number[span_11](end_span)
            [span_12](start_span)volume: parseFloat(ruckingData.volumeMoved),   // Strictly Number[span_12](end_span)
            [span_13](start_span)timestamp: new Date() // Accurate time locking[span_13](end_span)
        };

        [span_14](start_span)// 6. DUAL DEPOSIT: Personal Logs & Live Leaderboard[span_14](end_span)
        await db.collection('personal_logs').insertOne(finalData);
        await db.collection('live_leaderboard').insertOne(finalData);

        [span_15](start_span)await client.close();[span_15](end_span)

        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Data Locked in Bunker!' 
        [span_16](start_span)});[span_16](end_span)

    } catch (error) {
        return res.status(200).json({ 
            success: false, 
            error: 'BACKEND_ERROR: ' + error.message 
        [span_17](start_span)});[span_17](end_span)
    }
};
