const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  // name: type,
  userName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/gdaconcept/image/upload/v1614762472/workshop-artistify/default-profile_tbiwcc.jpg",
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
