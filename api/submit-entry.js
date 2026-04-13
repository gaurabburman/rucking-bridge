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
  // CORS Armor - WordPress se block na hone ke liye
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  try {
    const client = await connectToDatabase();
    const db = client.db('RuckingIndia_DB');
    const collection = db.collection('Live_Leaderboard');

    const data = req.body || {};

    const entry = {
      timestamp: new Date(),
      operator: data.operator_name || "Gaurab_Operator",
      distance_km: Number(data.distance) || 0,
      load_kg: Number(data.load) || 16.65, 
      total_volume: Number(data.volume) || 0,
      calories: Number(data.calories) || 0,
      pain_index: Number(data.pain_index) || 0, 
      source: "RuckingIndia_WP"
    };

    const result = await collection.insertOne(entry);

    return res.status(200).json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
