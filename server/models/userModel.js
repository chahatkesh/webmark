import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: { type: Object, default: {} },
  publishData: { type: Object, default: {} }
}, { minimize: false })


const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;