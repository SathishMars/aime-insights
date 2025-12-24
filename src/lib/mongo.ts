import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB || "aime";
  if (!uri) throw new Error("MONGO_URI is missing in env");

  client = new MongoClient(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });

  await client.connect();
  db = client.db(dbName);
  return db;
}
