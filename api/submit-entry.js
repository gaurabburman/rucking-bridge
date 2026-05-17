const admin = require('firebase-admin');
const { MongoClient } = require('mongodb'); [span_2](start_span)//[span_2](end_span)

module.exports = async (req, res) => {
    // 1. CORS ARMOR: Secure connection protocols
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); [span_3](start_span)//[span_3](end_span)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // RULE 4: ANTI-MEMORY LEAK SHIELD (Global declaration)
    let client; 

    try {
        // 2. FIREBASE SECURE INITIALIZATION
        if (!admin.apps.length) {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;
            if (privateKey) {
                // Handling Vercel escape formatting for RSA keys
                privateKey = privateKey.replace(/\\n/g, '\n'); [span_4](start_span)//[span_4](end_span)
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "ruckingindia-bunker",
                    [span_5](start_span)clientEmail: "firebase-adminsdk-fbsvc@ruckingindia-bunker.iam.gserviceaccount.com", //[span_5](end_span)
                    privateKey: privateKey,
                })
            });
        }

        const { idToken, ruckingData } = req.body;
        
        // 3. OPERATOR IDENTITY VERIFICATION
        const decodedToken = await admin.auth().verifyIdToken(idToken); [span_6](start_span)//[span_6](end_span)
        const uid = decodedToken.uid; [span_7](start_span)//[span_7](end_span)
        const email = decodedToken.email;

        // 4. CONNECTION TO MONGODB BUNKER
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect(); [span_8](start_span)//[span_8](end_span)
        const db = client.db('RuckingIndia_DB');

        // 5. 360-DEGREE TACTICAL DATA NORMALIZATION (Single Mission Object)
        const currentMissionLog = {
            mission_id: new Date().getTime().toString(),
            height_cm: parseFloat(ruckingData.heightCm) || [span_9](start_span)0, //[span_9](end_span)
            body_weight: parseFloat(ruckingData.bodyWeight) || [span_10](start_span)0, //[span_10](end_span)
            body_weight_unit: ruckingData.bodyWeightUnit || [span_11](start_span)"kg", //[span_11](end_span)
            ruck_weight: parseFloat(ruckingData.loadWeight) || [span_12](start_span)0, //[span_12](end_span)
            ruck_weight_unit: ruckingData.loadWeightUnit || [span_13](start_span)"kg", //[span_13](end_span)
            distance_km: parseFloat(ruckingData.distanceKm) || [span_14](start_span)0, //[span_14](end_span)
            duration_min: parseInt(ruckingData.durationMin) || [span_15](start_span)0, //[span_15](end_span)
            slope_percent: ruckingData.slopePercent || [span_16](start_span)"0", //[span_16](end_span)
            terrain_factor: ruckingData.terrainFactor || [span_17](start_span)"1.0", //[span_17](end_span)
            bmi: parseFloat(ruckingData.bmi) || [span_18](start_span)0, //[span_18](end_span)
            calories_burned: parseInt(ruckingData.caloriesBurned) || [span_19](start_span)0, //[span_19](end_span)
            volume_moved: parseFloat(ruckingData.volumeMoved) || [span_20](start_span)0, //[span_20](end_span)
            volume_unit: ruckingData.volumeUnit || [span_21](start_span)"KG-KM", //[span_21](end_span)
            pace: ruckingData.pace || [span_22](start_span)"0:00", //[span_22](end_span)
            timestamp: new Date() 
        };

        // RULE 1 & 2: SINGLE DOCUMENT PROTOCOL & 15-DAY HARD CAP
        [span_23](start_span)// Purane .insertOne ki jagah ab updateOne aur $push ka use ho raha hai[span_23](end_span).
        await db.collection('personal_logs').updateOne(
            { operator_uid: uid },
            {
                $set: {
                    operator_email: email,
                    [span_24](start_span)operator_name: ruckingData.operatorName || "Unknown Operator", //[span_24](end_span)
                    age: parseInt(ruckingData.age) || [span_25](start_span)0, //[span_25](end_span)
                    gender: ruckingData.gender || [span_26](start_span)"--", //[span_26](end_span)
                    country: ruckingData.country || [span_27](start_span)"Global", //[span_27](end_span)
                    last_updated: new Date()
                },
                $push: {
                    logs: {
                        $each: [currentMissionLog],
                        $sort: { timestamp: -1 }, 
                        $slice: 15 
                    }
                }
            },
            { upsert: true }
        );

        // RULE 3: ZION MATRIX OVERWRITE RULE
        [span_28](start_span)// Yahan bhi .insertOne ko hata kar .updateOne lagaya gaya hai taaki duplicate entries na banein[span_28](end_span).
        await db.collection('live_leaderboard').updateOne(
            { operator_uid: uid },
            {
                $set: {
                    operator_email: email,
                    operator_name: ruckingData.operatorName || "Unknown Operator",
                    age: parseInt(ruckingData.age) || 0,
                    gender: ruckingData.gender || "--",
                    country: ruckingData.country || "Global",
                    ruck_weight: parseFloat(ruckingData.loadWeight) || 0,
                    volume_moved: parseFloat(ruckingData.volumeMoved) || 0,
                    calories_burned: parseInt(ruckingData.caloriesBurned) || 0,
                    pace: ruckingData.pace || "0:00",
                    timestamp: new Date()
                }
            },
            { upsert: true }
        );

        [span_29](start_span)// Success Response[span_29](end_span)
        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Tactical Data Secured & Capped to 15 Days!' 
        });

    } catch (error) {
        console.error("BUNKER BREACH ERROR:", error.message);
        [span_30](start_span)// Error Response[span_30](end_span)
        return res.status(200).json({ 
            success: false, 
            error: 'BACKEND_ERROR: ' + error.message 
        });
    } finally {
        // RULE 4: ANTI-MEMORY LEAK SHIELD
        // Connection hamesha close hoga chahe error aaye ya success ho
        if (client) {
            await client.close(); 
        }
    }
};
