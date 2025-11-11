import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { boolean } from 'zod';

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true , select: false },
    role: {type: String,  enum: ['admin'],  default: 'admin'},
    isActive: {type: boolean,  default: false}
  },
  { timestamps: true },
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.pre('findByIdAndUpdate', async function (next) {
  if (!this.isModified('password')) return next();
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = async function (adminPassword) {
  const isValidPassword = await bcrypt.compare(adminPassword, this.password);
  return isValidPassword;
};

const AdminModel = model('admin', adminSchema);

export default AdminModel;