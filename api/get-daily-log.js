const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS ARMOR: Fallback access control for frontend dashboards
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    let client;
    try {
        // 2. FIREBASE INSTANCE INITIALIZATION
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

        // 3. SECURITY GATEWAY: Extraction of Bearer Identity Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'UNAUTHORIZED: Security token missing.' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const operatorEmail = decodedToken.email || "";

        // 4. MONGODB BUNKER NODE CONNECTION
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // COMMANDER LOCKED ROOT EMAIL IDENTIFIER
        const CORE_ADMIN_EMAIL = "gaurabburman@gmail.com";

        // 5. BLOCK EXECUTION: TREE STRUCTURE MATCHING READ FILTER
        let queryFilter = {};

        if (operatorEmail.toLowerCase() === CORE_ADMIN_EMAIL.toLowerCase()) {
            // Processing Admin extraction vector from Root layer
            queryFilter = { operator_uid: uid, storage_layer: "root" };
        } else {
            // Processing Standard Operator extraction vector from dynamic sub-tree folder
            queryFilter = { operator_uid: uid, storage_layer: `user_tree_${uid}` };
        }

        // 6. RETRIEVE TACTICAL INTELLIGENCE FROM VAULT
        // Telemetry is fetched with exact indexing matching timestamp hierarchy
        const logs = await db.collection('personal_logs')
            .find(queryFilter)
            .sort({ timestamp: -1 }) // Dynamic moving stack order: Newest log first
            .limit(15)               // Enforcing the strict tactical ceiling limit of 15 days
            .toArray();

        // 7. RETURN SECURE STRUCTURAL RESPONSE TO TELEMETRY GRID
        return res.status(200).json({
            success: true,
            message: 'TACTICAL INTEL RETRIEVED: Matrix filtered for the requested storage layer.',
            data: logs
        });

    } catch (error) {
        console.error("DASHBOARD BUNKER RETRIEVAL FAILURE:", error.message);
        // Returning 200 prevents cross-origin response blockage on browser level
        return res.status(200).json({ 
            success: false,
            error: 'BACKEND_FETCH_ERROR: ' + error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
};
