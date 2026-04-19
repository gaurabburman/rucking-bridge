const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    [span_6](start_span)[span_7](start_span)// 1. CORS ARMOR: Secure connection protocols[span_6](end_span)[span_7](end_span)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        [span_8](start_span)[span_9](start_span)// 2. FIREBASE SECURE INITIALIZATION[span_8](end_span)[span_9](end_span)
        if (!admin.apps.length) {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;
            if (privateKey) {
                [span_10](start_span)[span_11](start_span)// Handling Vercel escape formatting for RSA keys[span_10](end_span)[span_11](end_span)
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

        [span_12](start_span)[span_13](start_span)// 3. OPERATOR IDENTITY VERIFICATION[span_12](end_span)[span_13](end_span)
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        [span_14](start_span)[span_15](start_span)// 4. CONNECTION TO MONGODB BUNKER[span_14](end_span)[span_15](end_span)
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 5. 360-DEGREE TACTICAL DATA NORMALIZATION
        [span_16](start_span)[span_17](start_span)// Strictly capturing every single field from user UI inputs and calculation results[span_16](end_span)[span_17](end_span)
        const singleLifeEntry = {
            operator_uid: uid,
            operator_email: email,
            operator_name: ruckingData.operatorName || "Unknown Operator",
            age: parseInt(ruckingData.age) || 0,
            gender: ruckingData.gender || "--",
            country: ruckingData.country || "Global",
            
            [span_18](start_span)[span_19](start_span)// USER RAW INPUTS (Respecting KG/LB Engines)[span_18](end_span)[span_19](end_span)
            height_cm: parseFloat(ruckingData.heightCm) || 0,
            body_weight: parseFloat(ruckingData.bodyWeight) || 0,
            body_weight_unit: ruckingData.bodyWeightUnit || "kg", 
            ruck_weight: parseFloat(ruckingData.loadWeight) || 0,
            ruck_weight_unit: ruckingData.loadWeightUnit || "kg",
            distance_km: parseFloat(ruckingData.distanceKm) || 0,
            duration_min: parseInt(ruckingData.durationMin) || 0,
            slope_percent: ruckingData.slopePercent || "0",
            terrain_factor: ruckingData.terrainFactor || "1.0",

            [span_20](start_span)[span_21](start_span)// CORE ENGINE CALCULATION RESULTS[span_20](end_span)[span_21](end_span)
            bmi: parseFloat(ruckingData.bmi) || 0,
            calories_burned: parseInt(ruckingData.caloriesBurned) || 0,
            volume_moved: parseFloat(ruckingData.volumeMoved) || 0,
            volume_unit: ruckingData.volumeUnit || "KG-KM",
            pace: ruckingData.pace || "0:00",
            
            [span_22](start_span)timestamp: new Date() // Accurate mission locking[span_22](end_span)
        };

        [span_23](start_span)[span_24](start_span)// 6. ACTION: DUAL COLLECTION DEPOSIT[span_23](end_span)[span_24](end_span)
        [span_25](start_span)// Insert into Personal Logs (Maintains 15-day history)[span_25](end_span)
        await db.collection('personal_logs').insertOne(singleLifeEntry);
        
        [span_26](start_span)[span_27](start_span)// Insert into Leaderboard (Single Life Entry per mission)[span_26](end_span)[span_27](end_span)
        await db.collection('live_leaderboard').insertOne(singleLifeEntry);

        [span_28](start_span)[span_29](start_span)await client.close();[span_28](end_span)[span_29](end_span)

        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Tactical Data Secured in Bunker!' 
        [span_30](start_span)});[span_30](end_span)

    } catch (error) {
        console.error("BUNKER BREACH ERROR:", error.message);
        return res.status(200).json({ 
            success: false, 
            error: 'BACKEND_ERROR: ' + error.message 
        [span_31](start_span)[span_32](start_span)});[span_31](end_span)[span_32](end_span)
    }
};
