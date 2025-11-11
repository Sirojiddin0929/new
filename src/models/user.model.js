import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { boolean } from 'zod';

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: {type: String, required: true},
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user'], default: 'user' },
    isActive: { type: boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre('findByIdAndUpdate', async function (next) {
  if (!this.isModified('password')) return next();
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  const isValidPassword = await bcrypt.compare(userPassword, this.password);
  return isValidPassword;
};

const userModel = model('user', userSchema);

export default userModel;