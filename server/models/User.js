// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   resume: { type: String },
//   image: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// export default User


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: String, // Clerk user ID
  name: String,
  email: { type: String, unique: true },
  image: String,
  resume: String,
});

export default mongoose.model('User', userSchema);
