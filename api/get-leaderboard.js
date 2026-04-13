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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ status: "ERROR", message: 'Only GET allowed' });

  try {
    const client = await connectToDatabase();
    const db = client.db('RuckingIndia_DB');
    const collection = db.collection('Live_Leaderboard');

    const logs = await collection.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json({ count: logs.length, data: logs });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: error.message });
  }
}
