const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name:String,
  category:String,
  link:String,
  tag:String,
  icon:String
});

module.exports = mongoose.model('UserData',userDataSchema);
