import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://chahat-webmark:qwzOjkUcxoq5cbvj@cluster0.oa5edgb.mongodb.net/webmark').then(() => console.log('DB Connected'))
}
