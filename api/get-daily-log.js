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
        // 2. FIREBASE SECURE INITIALIZATION
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
        const operatorEmail = decodedToken.email ? decodedToken.email.toLowerCase() : '';

        // 4. MONGODB BUNKER CONNECTION
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');
        const collection = db.collection('personal_logs');

        let logsPayload = [];

        // 5. HYBRID BRANCHING PROTOCOL (Dada Root vs User Tree)
        // Hardcoded Master Control Check for Gaurab Burman's Root Access
        if (operatorEmail === 'gaurab.burman@gmail.com' || uid === 'master_root_id_placeholder') {
            // Root Scan: Checking if Asset-Light Array document exists for Dada
            const rootDoc = await collection.findOne({ operator_uid: uid, is_array_model: true });
            
            if (rootDoc && rootDoc.logs) {
                logsPayload = rootDoc.logs;
            } else {
                // Fallback Engine: Fetch old individual rows so your 15-day history is preserved
                const oldLogs = await collection
                    .find({ operator_uid: uid, is_array_model: { $ne: true } })
                    .sort({ timestamp: -1 })
                    .limit(15)
                    .toArray();
                logsPayload = oldLogs;
            }
        } else {
            // Tree Branching Model: Dynamic processing for new users/testing accounts
            const userTreeDoc = await collection.findOne({ operator_uid: uid });
            if (userTreeDoc && userTreeDoc.logs) {
                logsPayload = userTreeDoc.logs;
            } else {
                // If a new user has legacy documents, retrieve them safely
                const legacyUserLogs = await collection
                    .find({ operator_uid: uid, is_array_model: { $ne: true } })
                    .sort({ timestamp: -1 })
                    .limit(15)
                    .toArray();
                logsPayload = legacyUserLogs;
            }
        }

        // 6. RETURN SECURE PAYLOAD TO WEB DASHBOARD
        return res.status(200).json({
            success: true,
            message: 'Tactical Intel Retrieved via Hybrid Flow',
            data: logsPayload
        });

    } catch (error) {
        console.error("BUNKER RETRIEVAL ERROR:", error.message);
        return res.status(200).json({ 
            success: false,
            error: 'BACKEND_ERROR: ' + error.message
        });
    } finally {
        // 7. ANTI-MEMORY LEAK SHIELD
        if (client) {
            await client.close();
        }
    }
};
