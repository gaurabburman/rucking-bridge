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

        // 3. BLOCK EXECUTION: ZION MATRIX TOP 63 CALORIE EVALUATION
        // Database ke collection se documents ko calories_burned ke descending order me sort karke top 63 records pull karega
        const leaderboardData = await db.collection('live_leaderboard')
            .find({})
            .sort({ calories_burned: -1 }) // Highest Calorie Consumption First
            .limit(63)                     // Hard locked limit for top 63 operators
            .toArray();

        // 4. RETURN SECURE PAYLOAD TO GLOBAL MATRIX GRID
        return res.status(200).json({
            success: true,
            type: 'ZION_MATRIX',
            message: 'TACTICAL MATRIX LIVE: Top 63 operators loaded based on absolute calorie burning profile.',
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
            await client.close(); // Memory leak armor active
        }
    }
};
