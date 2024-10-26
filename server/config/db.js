import mongoose from "mongoose";

export const connectDB = async () => {
  const dbUri = process.env.MONGO_URI;
  if (!dbUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }
  await mongoose.connect(dbUri).then(() => console.log('DB Connected'));
}