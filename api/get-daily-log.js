const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS ARMOR: Secure connection protocols
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Pre-flight request pass
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Strictly allowing only GET strikes
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'TACTICAL ERROR: Only GET strikes allowed.' });
    }

    let client;

    try {
        // 2. FIREBASE SECURE INITIALIZATION (Vercel formatting handled)
        if (!admin.apps.length) {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;
            if (privateKey) {
                privateKey = privateKey.replace(/\\n/g, '\n');
            }
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "ruckingindia-bunker",
                    clientEmail: "firebase-adminsdk-fbsvc@ruckingindia-bunker.iam.gserviceaccount.com",
                    privateKey: privateKey,
                })
            });
        }

        // 3. VERIFY OPERATOR AUTHORIZATION TOKEN
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'UNAUTHORIZED: Identity token missing.' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 4. MONGODB BUNKER CONNECTION
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 5. FETCH 15-DAY TACTICAL TELEMETRY
        // Sirf wahi data pull hoga jo is specific operator (uid) ka hai
        const logs = await db.collection('personal_logs')
            .find({ operator_uid: uid })
            .sort({ timestamp: -1 }) // Newest mission first
            .limit(15) // Strictly 15-day telemetry
            .toArray();

        // 6. RETURN SECURE PAYLOAD TO DASHBOARD
        return res.status(200).json({
            success: true,
            message: 'Tactical Intel Retrieved',
            data: logs
        });

    } catch (error) {
        console.error("BUNKER RETRIEVAL ERROR:", error.message);
        // Returning 200 with success: false prevents strict CORS block on frontend UI
        return res.status(200).json({ 
            success: false,
            error: 'BACKEND_ERROR: ' + error.message
        });
    } finally {
        if (client) {
            await client.close(); // Memory leak prevention
        }
    }
};
