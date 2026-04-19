const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. STRATEGIC ACCESS CONTROL (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // 2. FIREBASE ADMIN INITIALIZATION (Vercel Secure Protocol)
        if (!admin.apps.length) {
            // Processing Private Key for Vercel formatting
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

        const { idToken, ruckingData } = req.body;

        // 3. OPERATOR IDENTITY VERIFICATION
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // 4. CONNECTION TO MONGODB BUNKER
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 5. 360-DEGREE TACTICAL DATA NORMALIZATION
        // Strictly capturing every single field from the UI + Results
        const singleLifeEntry = {
            operator_uid: uid,
            operator_email: email,
            operator_name: ruckingData.operatorName || "Unknown Operator",
            age: parseInt(ruckingData.age) || 0,
            gender: ruckingData.gender || "--",
            country: ruckingData.country || "Global",
            
            // USER RAW INPUT DATA (Respecting KG/LB Engines)
            height_cm: parseFloat(ruckingData.heightCm) || 0,
            body_weight: parseFloat(ruckingData.bodyWeight) || 0,
            body_weight_unit: ruckingData.bodyWeightUnit || "kg", 
            ruck_weight: parseFloat(ruckingData.loadWeight) || 0,
            ruck_weight_unit: ruckingData.loadWeightUnit || "kg",
            distance_km: parseFloat(ruckingData.distanceKm) || 0,
            duration_min: parseInt(ruckingData.durationMin) || 0,
            slope_percent: ruckingData.slopePercent || "0",
            terrain_factor: ruckingData.terrainFactor || "1.0",

            // CORE ENGINE CALCULATION RESULTS
            bmi: parseFloat(ruckingData.bmi) || 0,
            calories_burned: parseInt(ruckingData.caloriesBurned) || 0,
            volume_moved: parseFloat(ruckingData.volumeMoved) || 0,
            volume_unit: ruckingData.volumeUnit || "KG-KM",
            pace: ruckingData.pace || "0:00",
            
            timestamp: new Date() // Locked mission time
        };

        // 6. ACTION: DUAL DEPOSIT SYNC
        // 1. Insert into Personal Logs (15-day telemetry)
        await db.collection('personal_logs').insertOne(singleLifeEntry);
        
        // 2. Upsert into Live Leaderboard (The Zion 63 Matrix)
        // Keeps only the most recent tactical record per operator
        await db.collection('live_leaderboard').updateOne(
            { operator_uid: uid },
            { $set: singleLifeEntry },
            { upsert: true }
        );

        await client.close();

        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Tactical Intelligence Secured in Bunker!' 
        });

    } catch (error) {
        console.error("BUNKER BREACH ERROR:", error.message);
        return res.status(200).json({ 
            success: false, 
            error: 'BACKEND_ERROR: ' + error.message 
        });
    }
};
