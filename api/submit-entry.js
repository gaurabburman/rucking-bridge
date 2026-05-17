const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS ARMOR: Secure connection protocols
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // RULE 4: GLOBAL ANTI-MEMORY LEAK SHIELD
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

        const { idToken, ruckingData } = req.body;
        
        // 3. OPERATOR IDENTITY VERIFICATION
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const operatorEmail = decodedToken.email ? decodedToken.email.toLowerCase() : '';

        // 4. CONNECTION TO MONGODB BUNKER
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // =========================================================================
        // 🔥 CRITICAL SELF-HEALING BLOCK: AUTOMATIC 'USERS' PROFILE INJECTION
        // =========================================================================
        const userProfileExists = await db.collection('users').findOne({ uid: uid });
        if (!userProfileExists) {
            const automaticProfileEntry = {
                uid: uid,
                name: ruckingData.operatorName || "Unknown Operator",
                email: operatorEmail,
                mobile: "+919932231121", // Fallback Default or Dynamic Parameter
                role: operatorEmail === 'gaurab.burman@gmail.com' ? 'master-ops' : 'civilian-ops',
                status: 'active',
                registered_at: new Date()
            };
            await db.collection('users').updateOne(
                { uid: uid },
                { $set: automaticProfileEntry },
                { upsert: true }
            );
            console.log(`📡 Dynamic Target Lock: User profile self-healed inside bunker for UID: ${uid}`);
        }
        // =========================================================================

        // 5. 360-DEGREE TACTICAL DATA NORMALIZATION (Single Mission Object)
        const currentMissionLog = {
            mission_id: new Date().getTime().toString(),
            height_cm: parseFloat(ruckingData.heightCm) || 0,
            body_weight: parseFloat(ruckingData.bodyWeight) || 0,
            body_weight_unit: ruckingData.bodyWeightUnit || "kg",
            ruck_weight: parseFloat(ruckingData.loadWeight) || 0,
            ruck_weight_unit: ruckingData.loadWeightUnit || "kg",
            distance_km: parseFloat(ruckingData.distanceKm) || 0,
            duration_min: parseInt(ruckingData.durationMin) || 0,
            slope_percent: ruckingData.slopePercent || "0",
            terrain_factor: ruckingData.terrainFactor || "1.0",
            bmi: parseFloat(ruckingData.bmi) || 0,
            calories_burned: parseInt(ruckingData.caloriesBurned) || 0,
            volume_moved: parseFloat(ruckingData.volumeMoved) || 0,
            volume_unit: ruckingData.volumeUnit || "KG-KM",
            pace: ruckingData.pace || "0:00",
            timestamp: new Date() 
        };

        // 6. ACTION: DUAL COLLECTION WRITING WITH HYBRID BRANCHING RULES
        if (operatorEmail === 'gaurab.burman@gmail.com') {
            // DADA ROOT MODE: Save data as old flat individual documents to protect your history
            const flatLogEntry = {
                ...currentMissionLog,
                operator_uid: uid,
                operator_email: operatorEmail,
                operator_name: ruckingData.operatorName || "Gaurab Burman",
                age: parseInt(ruckingData.age) || 45,
                gender: ruckingData.gender || "male",
                country: ruckingData.country || "India"
            };
            await db.collection('personal_logs').insertOne(flatLogEntry);
        } else {
            // USER TREE MODE: Dynamic segmented arrays for Lipi and Maa
            await db.collection('personal_logs').updateOne(
                { operator_uid: uid },
                {
                    $set: {
                        operator_email: operatorEmail,
                        operator_name: ruckingData.operatorName || "Unknown Operator",
                        age: parseInt(ruckingData.age) || 0,
                        gender: ruckingData.gender || "--",
                        country: ruckingData.country || "Global",
                        is_array_model: true, // Safeguards telemetry matching routing
                        last_updated: new Date()
                    },
                    $push: {
                        logs: {
                            $each: [currentMissionLog],
                            $sort: { timestamp: -1 }, 
                            $slice: 15 // Keeps 15-day hard cap for storage shield
                        }
                    }
                },
                { upsert: true }
            );
        }

        // 7. ZION MATRIX UNIFIED UPDATE RULE (One Operator = One Leaderboard Row)
        await db.collection('live_leaderboard').updateOne(
            { operator_uid: uid },
            {
                $set: {
                    operator_email: operatorEmail,
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

        // Success Response
        return res.status(200).json({ 
            success: true, 
            message: 'MISSION SUCCESS: Tactical Data Synchronized and Secured!' 
        });

    } catch (error) {
        console.error("BUNKER BREACH ERROR:", error.message);
        return res.status(200).json({ 
            success: false, 
            error: 'BACKEND_ERROR: ' + error.message 
        });
    } finally {
        // ANTI-MEMORY LEAK SHIELD ALWAYS ENFORCED
        if (client) {
            await client.close(); 
        }
    }
};
