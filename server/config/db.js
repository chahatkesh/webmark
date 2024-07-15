import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://chahat-webmark:Chahat1234@cluster0.qhrv3fd.mongodb.net/webmark').then(() => console.log('DB Connected'))
}
