import { MongoClient } from 'mongodb';
export async function connect() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env or your environment. See .env.example.');
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  return client;
}
