const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS ARMOR: Secure connection protocols
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

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

        // 3. SECURITY GATEWAY: Token Extraction & Validation
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'UNAUTHORIZED: Identity token missing.' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const operatorEmail = decodedToken.email || "";

        // 4. EXTRACT PAYLOAD FROM CALCULATOR FRONTEND
        const { ruckingData } = req.body;
        if (!ruckingData) {
            return res.status(400).json({ success: false, error: 'BAD REQUEST: Rucking data payload missing.' });
        }

        // 5. MONGODB BUNKER CONNECTION
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 6. MAP DATA ENGINE STRUCTURE (Strictly keeping your schema names untouched)
        const singleLifeEntry = {
            operator_uid: uid,
            operator_email: operatorEmail,
            operator_name: ruckingData.operatorName || "Unknown Operator",
            operator_type: ruckingData.operatorType || "civilian",
            age: parseInt(ruckingData.age) || 0,
            country: ruckingData.country || "India",
            gender: ruckingData.gender || "male",
            ruck_weight: parseFloat(ruckingData.loadWeight) || 0,
            pace: ruckingData.pace || "00:00",
            calories_burned: parseInt(ruckingData.caloriesBurned) || 0,
            volume_moved: parseFloat(ruckingData.volumeMoved) || 0,
            height_cm: parseFloat(ruckingData.heightCm) || 0,
            body_weight: parseFloat(ruckingData.bodyWeight) || 0,
            distance_km: parseFloat(ruckingData.distanceKm) || 0,
            duration_min: parseInt(ruckingData.durationMin) || 0,
            timestamp: ruckingData.timestamp || new Date().toISOString()
        };

        // COMMANDER LOCKED ROOT EMAIL IDENTIFIER
        const CORE_ADMIN_EMAIL = "gaurabburman@gmail.com"; 

        // 7. BLOCK EXECUTION: PERSONAL LOGS HANDLING WITH DYNAMIC TRACK SEPARATION
        let logFilter = {};
        
        if (operatorEmail.toLowerCase() === CORE_ADMIN_EMAIL.toLowerCase()) {
            // Main Commander Root Level Storage Path
            logFilter = { operator_uid: uid, storage_layer: "root" };
            singleLifeEntry.storage_layer = "root";
        } else {
            // Regular User Tree Isolated Structure 
            logFilter = { operator_uid: uid, storage_layer: `user_tree_${uid}` };
            singleLifeEntry.storage_layer = `user_tree_${uid}`;
        }

        // Save current transaction mission record
        await db.collection('personal_logs').insertOne(singleLifeEntry);

        // Fetch logs sorted by latest timestamp to enforce strict 15-day restriction
        const personalLogsArray = await db.collection('personal_logs')
            .find(logFilter)
            .sort({ timestamp: -1 })
            .toArray();

        // Strict 15-Day Roll-Over Capping Trigger Logic
        if (personalLogsArray.length > 15) {
            const excessLogs = personalLogsArray.slice(15);
            const idsToRemove = excessLogs.map(log => log._id);
            await db.collection('personal_logs').deleteMany({ _id: { $in: idsToRemove } });
        }

        // 8. BLOCK EXECUTION: ANTI-DUPLICATION GLOBAL LEADERBOARD INTEGRITY
        const existingLeaderboardRecord = await db.collection('live_leaderboard').findOne({ operator_uid: uid });

        if (!existingLeaderboardRecord) {
            // Unique new entry on matrix grid list
            await db.collection('live_leaderboard').insertOne(singleLifeEntry);
        } else {
            // Evaluate if current system log has higher volume performance than historic data
            if (singleLifeEntry.volume_moved > (existingLeaderboardRecord.volume_moved || 0)) {
                await db.collection('live_leaderboard').updateOne(
                    { operator_uid: uid },
                    { $set: singleLifeEntry }
                );
            }
            // If new volume performance is lower, previous high score stays safe without row splitting.
        }

        // 9. COLD SUCCESS RETURNING PAYLOAD
        return res.status(200).json({
            success: true,
            message: 'BUNKER SYNC COMPLETE: Telemetry Isolated for Commander & 15-Day Rolling Limits Enforced Successfully.'
        });

    } catch (error) {
        console.error("CRITICAL BACKEND VAULT SECURITY ERROR:", error.message);
        return res.status(200).json({
            success: false,
            error: 'BACKEND_SECURE_ERROR: ' + error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
};
