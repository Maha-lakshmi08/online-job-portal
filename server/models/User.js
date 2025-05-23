import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  resume: String
}, { timestamps: true });


export default mongoose.model('User', userSchema);

