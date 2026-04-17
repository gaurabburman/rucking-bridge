const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 🛡️ 1. CORS SHIELD (Allowing GET requests for retrieving data)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Tactical Error: Only GET strikes allowed here.' });
    }

    try {
        // 🛡️ 2. CHECK ENVIRONMENT VARIABLES
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.MONGODB_URI) {
            return res.status(500).json({ success: false, error: 'ENV_MISSING: Bunker configuration incomplete.' });
        }

        // 🛡️ 3. PRIVATE KEY MUTATION
        let privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }

        // 🛡️ 4. INITIALIZE FIREBASE
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        }

        // 🛡️ 5. VERIFY OPERATOR IDENTITY (Token from Frontend)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'UNAUTHORIZED: Identity not verified.' });
        }
        
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 🛡️ 6. CONNECT TO MONGODB VAULT
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 🛡️ 7. FETCH LAST 15 DAYS DATA FOR THIS SPECIFIC OPERATOR
        const logs = await db.collection('personal_logs')
            .find({ operator_uid: uid })
            .sort({ timestamp: -1 }) // Sort by newest first
            .limit(15) // Strictly 15 records
            .toArray();

        await client.close();

        return res.status(200).json({ 
            success: true, 
            message: 'Intel Retrieved Successfully!',
            data: logs 
        });

    } catch (error) {
        console.error("Retrieval Error:", error);
        return res.status(500).json({ success: false, error: 'BACKEND_ERROR: ' + error.message });
    }
};
