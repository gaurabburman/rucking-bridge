import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    if (!uri) throw new Error("MONGODB_URI is missing in Vercel Environment Variables!");
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    // CORS Armor - Allows ANY public user to view the leaderboard
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Only GET allowed' });

    try {
        const client = await connectToDatabase();
        const db = client.db('RuckingIndia_DB');
        const collection = db.collection('Live_leaderboard'); // Make sure your logs go here!

        // 🔥 THE MUTATION SORT: Highest Calories first, Limit to Top 63 (7x9)
        const data = await collection
            .find({})
            // If your submit API saves calories inside a "data" object, use "data.caloriesBurned". 
            // If it saves directly on the root, use "caloriesBurned".
            .sort({ "data.caloriesBurned": -1, "caloriesBurned": -1 }) 
            .limit(63)
            .toArray();

        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
