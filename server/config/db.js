import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://chahat-webmark:Chahat1234@cluster0.oa5edgb.mongodb.net/webmark').then(() => console.log('DB Connected'))
}
