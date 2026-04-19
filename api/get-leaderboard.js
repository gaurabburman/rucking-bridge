const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    // 1. CORS SHIELD - Secure Public & Private Access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('RuckingIndia_DB');
        
        // Query Parameters catch karne ke liye
        const { uid, mode } = req.query;

        // --- MODE A: USER DAILY LOG (15-Day Telemetry) ---
        if (mode === 'personal' && uid) {
            const personalLogs = await db.collection('personal_logs')
                .find({ operator_uid: uid })
                .sort({ timestamp: -1 }) // Latest first
                .limit(15) // Strictly 15-Day Telemetry
                .toArray();

            return res.status(200).json({ 
                success: true, 
                type: 'TELEMETRY_LOG',
                data: personalLogs 
            });
        }

        // --- MODE B: ZION LEADERBOARD (Live Matrix) ---
        // Top 50 operators filter based on Volume Moved
        const leaderboardData = await db.collection('live_leaderboard')
            .find({})
            .sort({ volume_moved: -1 }) 
            .limit(50)
            .toArray();

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
        await client.close();
    }
};
