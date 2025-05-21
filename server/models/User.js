import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk's user ID
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  resume: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);
