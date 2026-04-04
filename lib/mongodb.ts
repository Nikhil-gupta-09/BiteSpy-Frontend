import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClientPromise() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("Missing MONGODB_URI. Set your MongoDB Atlas connection string in environment variables.");
    }

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5000,
    });

    return client.connect();
}

export async function getMongoDb() {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = createMongoClientPromise();
    }

    const resolvedClient = await global._mongoClientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "bitespy";
    return resolvedClient.db(dbName);
}
