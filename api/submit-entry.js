import { MongoClient } from 'mongodb';

// Direct Encrypted Key + Database Name Inject kiya gaya hai
const uri = "mongodb+srv://ruckingindia_web:GLburman@ruckingindiacal.1wisjw0.mongodb.net/RuckingIndia_DB?retryWrites=true&w=majority&appName=RUCKINGINDIACAL";
let cachedClient = null;

// Connection Pooling Protocol (Speed Booster)
async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ status: "ERROR", message: 'Only POST allowed' });

  try {
    const client = await connectToDatabase();
    const db = client.db('RuckingIndia_DB');
    const collection = db.collection('Live_Leaderboard');

    const data = req.body || {};
    const entry = {
      timestamp: new Date(),
      operator: data.operator_name || "Gaurab_Operator",
      distance_km: parseFloat(data.distance) || 0,
      load_kg: parseFloat(data.load) || 16.65, // Numerology 7 & 9 compliant load
      total_volume: parseFloat(data.volume) || 0,
      calories: parseFloat(data.calories) || 0,
      pain_index: parseInt(data.pain_index) || 0,
      source: "RuckingIndia_WP"
    };

    const result = await collection.insertOne(entry);
    return res.status(200).json({ status: "SUCCESS", mongo_id: result.insertedId });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
}
