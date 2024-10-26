import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://webmark:aXKOFEyaPwQE8Tmv@cluster0.oa5edgb.mongodb.net/webmark').then(() => console.log('DB Connected'))
}
