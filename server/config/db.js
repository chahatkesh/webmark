import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const dbUri = process.env.MONGO_URI;
  if (!dbUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  mongoose.set("bufferCommands", false);

  connectionPromise = mongoose
    .connect(dbUri, {
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 10),
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 5000),
    })
    .then((connection) => {
      console.log("DB Connected");
      return connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};
