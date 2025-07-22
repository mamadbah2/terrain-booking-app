import { MongoClient } from "mongodb";

// import dotenv car il est nécessaire pour charger les variables d'environnement
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | null;
}


if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV !== "production") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {});
    global._mongoClientPromise = client.connect();
  }
    clientPromise = global._mongoClientPromise;

} else {
    const client = new MongoClient(uri, {});
    clientPromise = client.connect();
}

export default clientPromise;
