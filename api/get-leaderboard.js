const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS SHIELD - Secure Public & Private Telemetry Access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    let client;
    try {
        // 2. CONNECTION TO MONGODB VAULT NODE
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // 3. BLOCK EXECUTION: REAL-TIME SINGLE-SOURCE AGGREGATION PIPELINE
        // Yeh query live personal_logs ke andar se har unique operator ka absolute highest calorie log extract karegi
        const leaderboardData = await db.collection('personal_logs').aggregate([
            // Step A: Newest entries ko upar rakhna taaki latest metadata (name, country, etc.) perfectly load ho sake
            { $sort: { timestamp: -1 } },
            
            // Step B: Group by Operator ID aur realtime mein unka absolute highest calorie record block freeze karna
            {
                $group: {
                    _id: "$operator_uid",
                    operator_uid: { $first: "$operator_uid" },
                    operator_email: { $first: "$operator_email" },
                    operator_name: { $first: "$operator_name" },
                    operator_type: { $first: "$operator_type" },
                    age: { $first: "$age" },
                    country: { $first: "$country" },
                    gender: { $first: "$gender" },
                    
                    // Realtime maximum absolute tracker selection mapping
                    max_calories: { $max: "$calories_burned" },
                    
                    // Structural preservation ring (پورے document array state ke matching keys load karne ke liye)
                    all_docs: { $push: "$$ROOT" }
                }
            },
            
            // Step C: Us pooray group stream mein se strictly wahi single document return karna jisme max_calories maujood hai
            {
                $project: {
                    _id: 0,
                    best_mission: {
                        $filter: {
                            input: "$all_docs",
                            as: "doc",
                            cond: { $eq: ["$$doc.calories_burned", "$max_calories"] }
                        }
                    }
                }
            },
            
            // Step D: Array field ko flatten karke safe row document state mein convert karna
            { $unwind: "$best_mission" },
            
            // Step E: Output keys ko aapke original frontend data metrics template layer ke sath mirror align karna
            {
                $project: {
                    operator_uid: "$best_mission.operator_uid",
                    operator_email: "$best_mission.operator_email",
                    operator_name: "$best_mission.operator_name",
                    operator_type: "$best_mission.operator_type",
                    age: "$best_mission.age",
                    country: "$best_mission.country",
                    gender: "$best_mission.gender",
                    ruck_weight: "$best_mission.ruck_weight",
                    ruck_weight_unit: "$best_mission.ruck_weight_unit",
                    pace: "$best_mission.pace",
                    calories_burned: "$best_mission.calories_burned",
                    volume_moved: "$best_mission.volume_moved",
                    volume_unit: "$best_mission.volume_unit",
                    height_cm: "$best_mission.height_cm",
                    body_weight: "$best_mission.body_weight",
                    body_weight_unit: "$best_mission.body_weight_unit",
                    distance_km: "$best_mission.distance_km",
                    duration_min: "$best_mission.duration_min",
                    timestamp: "$best_mission.timestamp"
                }
            },
            
            // Step F: Global sorting execution parameter based on highest calories_burned first
            { $sort: { calories_burned: -1 } },
            
            // Step G: Hard-locked ceiling filter cap strictly to Top 63 Elite operators grid
            { $limit: 63 }
        ]).toArray();

        // 4. RETURN SECURE PAYLOAD TO GLOBAL MATRIX GRID
        return res.status(200).json({
            success: true,
            type: 'ZION_MATRIX',
            message: 'TACTICAL MATRIX LIVE: Top 63 elite synchronized directly from the single-source-of-truth log bank.',
            data: leaderboardData
        });

    } catch (error) {
        console.error("CRITICAL BUNKER RETRIEVAL ERROR:", error.message);
        return res.status(200).json({
            success: false,
            error: 'FETCH_ERROR: ' + error.message
        });
    } finally {
        if (client) {
            await client.close(); // Prevent server timeout latency leaks
        }
    }
};
