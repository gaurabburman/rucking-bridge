const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS SHIELD - Secure Public & Private Access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Pre-flight request pass
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let client;

    try {
        // 2. MONGODB BUNKER CONNECTION
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('RuckingIndia_DB');

        // Query Parameters catch karne ke liye
        const { uid, mode } = req.query;

        // --- MODE A: USER DAILY LOG (15-Day Telemetry Capped Array Protocol) ---
        if (mode === 'personal' && uid) {
            // Fetching the single optimized document instead of multiple documents
            const userDoc = await db.collection('personal_logs').findOne({ operator_uid: uid });
            
            // Extracting the strictly capped array safely
            const personalLogs = userDoc && userDoc.logs ? userDoc.logs : [];

            return res.status(200).json({
                success: true,
                type: 'TELEMETRY_LOG',
                data: personalLogs
            });
        }

        // --- MODE B: ZION LEADERBOARD (Live Matrix) ---
        // Top 63 operators filter based on Volume Moved (Strict Zion 63 Rule)
        const leaderboardData = await db.collection('live_leaderboard')
            .find({})
            .sort({ volume_moved: -1 })
            .limit(63) // Locked to exactly 63 operators
            .toArray();

        // 3. RETURN SECURE PAYLOAD
        return res.status(200).json({
            success: true,
            type: 'ZION_MATRIX',
            data: leaderboardData
        });

    } catch (error) {
        console.error("Bunker Retrieval Error:", error.message);
        return res.status(500).json({
            success: false,
            error: 'FETCH_ERROR: ' + error.message
        });
    } finally {
        // 4. MEMORY LEAK PREVENTION (Always closes connection even if API fails)
        if (client) {
            await client.close();
        }
    }
};
