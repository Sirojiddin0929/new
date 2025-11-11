import PostModel from '../models/post.model.js';
import { ApiError } from '../helper/errorMessage.js';
import { mailer } from '../helper/nodeMailer.js';
import mongoose from 'mongoose';
import { OtpModel } from '../models/otp.model.js';
import { generateOtp } from '../helper/otp.js';

export const PostController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const fields = Object.keys(PostModel.schema.paths).filter(
        (f) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(f) &&
          PostModel.schema.paths[f].instance === 'String',
      );
      const query = search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {};
      const [data, total] = await Promise.all([
        PostModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        PostModel.countDocuments(query),
      ]);
      return res.status(200).json({
        success: true,
        message: `RETRIEVED ALL DATA SUCCESSFULLY!`,
        data,
        total,
        limit,
        page,
      });
    } catch (error) {
      return next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await PostModel.findOne({ _id: id });
      if (!data) {
        return next(new ApiError(404, `NOT FOUND SUCH AN ID`));
      }
      return res.status(200).json({
        success: true,
        message: `RETRIEVED ONE FROM DATA SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  createOne: async (req, res, next) => {
    try {
      const body = req.validatedData;
      body.customer_id = req.user._id
      const data = await PostModel.create(body);
      return res.status(201).json({
        success: true,
        message: `CREATED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  updateOne: async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const { id } = req.params;
      const body = req.validatedData;
      const data = await PostModel.findByIdAndUpdate(id, body, { new: true, session });
      if (!data) {
        return next(new ApiError(404, `NOT FOUND SUCH AN ID`));
      }
      const otp = await generateOtp();
      await mailer(req.user.email, otp);
      await OtpModel.create([{ otp, user_id: req.user.id }], {session});
      await session.commitTransaction();
      await session.endSession();
      return res.status(200).json({
        success: true,
        message: `UPDATED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      return next(error);
    }
  },

  deleteOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await PostModel.findByIdAndDelete({ _id: id });
      if (!data) {
        return next(new ApiError(404, `NOT FOUND SUCH AN ID`));
      }
      return res.status(200).json({
        success: true,
        message: `DELETED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },
};