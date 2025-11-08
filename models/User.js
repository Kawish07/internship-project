import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    resetToken: { type: String },
    resetExpires: { type: Date }
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
