import { ApiError } from '../helper/errorMessage.js';
import UserModel from '../models/user.model.js';

export const UserController = {
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const fields = Object.keys(UserModel.schema.paths).filter(
        (f) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(f)  &&
          UserModel.schema.paths[f].instance === 'String',
      );
      const query = search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {};
      const [data, total] = await Promise.all([
        UserModel.find({...query, id: req.user._id}).skip(skip).limit(limit).sort({ createdAt: -1 }),
        UserModel.countDocuments(query),
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
      const data = await UserModel.findOne({ _id: id });
      if (!data) {
        return next(new ApiError(404, `NOT FOUND SUCH AN ID!` ))
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
      const data = await UserModel.create(body)
      const user = data.toObject()
      delete user.password;
      return res.status(201).json({
        success: true,
        message: `CREATED SUCCESSFULLY!`,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },

 updateOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.validatedData;
      const data = await UserModel.findByIdAndUpdate(id, body, { new: true });
      if (!data) {
        return next(new ApiError(404, `NOT FOUND SUCH AN ID` ))
      }
      return res.status(200).json({
        success: true,
        message: `UPDATED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  deleteOne: async(req, res, next) => {
    try {
      const { id } = req.params;
      const data = await UserModel.findByIdAndDelete({ _id: id });
      if (!data) {
        return next(new ApiError(404, `NOT FOUND SUCH AN ID` ))
      }
      return res.status(200).json({
        success: true,
        message: `DELETED SUCCESSFULLY!`,
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
}