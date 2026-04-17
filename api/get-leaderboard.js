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
    // CORS Armor
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Only GET allowed' });

    try {
        const client = await connectToDatabase();
        const db = client.db('RuckingIndia_DB');
        
        // 💥 FIX 1: Exact lowercase collection name
        const collection = db.collection('live_leaderboard'); 

        // 💥 FIX 2: Sort exactly by 'calories'
        const data = await collection
            .find({})
            .sort({ calories: -1 }) 
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
