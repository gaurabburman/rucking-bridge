module.exports = async (req, res) => {

    // 🛡️ 1. SHIELD UP: ALWAYS ALLOW CORS FIRST
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 🛡️ 2. SAFE DEPENDENCY CHECK (Prevents 500 Crash)
        let admin, MongoClient;
        try {
            admin = require('firebase-admin');
            MongoClient = require('mongodb').MongoClient;
        } catch (pkgErr) {
            return res.status(200).json({ success: false, error: 'PACKAGE_MISSING: Please create a package.json file with firebase-admin and mongodb.' });
        }

        // 🛡️ 3. SAFE ENVIRONMENT VARIABLES CHECK
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.MONGODB_URI) {
            return res.status(200).json({ success: false, error: 'ENV_MISSING: Environment variables are not loaded in Vercel.' });
        }

        // 🛡️ 4. PRIVATE KEY MUTATION (Fixes Vercel's formatting issues)
        let privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }

        // 🛡️ 5. INITIALIZE FIREBASE (Only once)
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey
                })
            });
        }

        // 🛡️ 6. API PULSE CHECK (For direct browser testing)
        if (req.method === 'GET') {
            return res.status(200).json({ success: true, message: 'BUNKER API IS ALIVE AND SECURE! 💥' });
        }

        // ------------- ACTUAL DATA SAVING LOGIC -------------
        const { idToken, ruckingData } = req.body;
        
        if (!idToken) {
            return res.status(200).json({ success: false, error: 'NO_TOKEN: Operator identity not found.' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 💥 ACTION A: Save to Personal Logs (For Operator Dashboard)
        const logEntry = {
            operator_uid: uid,
            operator_email: email,
            data: ruckingData,
            timestamp: new Date()
        };
        await db.collection('personal_logs').insertOne(logEntry);

        // 💥 ACTION B: Save to Live Leaderboard (For The Global Matrix)
        await db.collection('live_leaderboard').insertOne({
            name: ruckingData.operatorName || 'Anonymous Operator',
            age: ruckingData.age || '--',
            country: ruckingData.country || 'Global',
            gender: ruckingData.gender || 'Unknown',
            ruckWeight: ruckingData.ruckWeight || 0,
            pace: ruckingData.pace || '0:00',
            unit: ruckingData.unit || 'kg',
            calories: ruckingData.caloriesBurned || 0,
            volume: ruckingData.volumeMoved || 0,
            timestamp: new Date()
        });

        await client.close();

        return res.status(200).json({ success: true, message: 'MISSION SUCCESS: Data Locked in Bunker!' });

    } catch (error) {
        // 🛡️ 7. GRACEFUL FALLBACK (Catches deep backend errors without 500 crash)
        return res.status(200).json({ success: false, error: 'BACKEND_ERROR: ' + error.message });
    }
};
