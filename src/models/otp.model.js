import { Schema, model } from "mongoose"

const otpSchema = new Schema({
  otp: {
    type: String,
    trim: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "customer"
  }
}, { timestamps: true })

export const OtpModel = model("otp", otpSchema)