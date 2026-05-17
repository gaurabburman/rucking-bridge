const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. SHIELD UP: CORS FIRST (Secure gateway setup)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let client;
    try {
        // 2. SAFE DEPENDENCY CHECK & SYSTEM INITIALIZATION
        // Matching exact hardcoded credentials pattern used in submit-entry.js
        if (!admin.apps.length) {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;
            if (privateKey) {
                privateKey = privateKey.replace(/\\n/g, '\n');
                // Clean up potential quotes from environment variables safely
                if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                    privateKey = privateKey.slice(1, -1);
                }
            }
            
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "ruckingindia-bunker",
                    clientEmail: "firebase-adminsdk-fbsvc@ruckingindia-bunker.iam.gserviceaccount.com",
                    privateKey: privateKey,
                })
            });
        }

        const { idToken, profileData } = req.body;

        if (!idToken) {
            return res.status(200).json({ success: false, error: 'NO_TOKEN: Registration identity not found.' });
        }

        if (!profileData) {
            return res.status(200).json({ success: false, error: 'BAD_REQUEST: Profile payload data missing.' });
        }

        // 3. VERIFY IDENTITY VIA FIREBASE GATEWAY
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 4. CONNECT TO MONGODB VAULT
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 5. ACTION: Save/Update User Profile (Strict Data Validation Layer)
        const userEntry = {
            uid: uid,
            name: profileData.name || "Unknown Operator",
            email: profileData.email || decodedToken.email || "",
            mobile: profileData.mobile || "", // Safe fallback for Phone Numbers
            role: profileData.role || 'civilian-ops',
            status: 'active',
            registered_at: new Date() // Synchronizing exact Date and Time
        };

        // Update if exists (upsert logic to keep users collection distinct and clean)
        await db.collection('users').updateOne(
            { uid: uid },
            { $set: userEntry },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: 'MISSION SUCCESS: Operator Profile Secured in Bunker!'
        });

    } catch (error) {
        console.error("REGISTRATION BUNKER EXCEPTION:", error.message);
        return res.status(200).json({ 
            success: false, 
            error: 'BACKEND_ERROR: ' + error.message 
        });
    } finally {
        if (client) {
            await client.close(); // Memory leak management protocol active
        }
    }
};
