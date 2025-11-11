import BlogModel from '../models/blog.model.js';
import { mailer } from '../helper/nodeMailer.js';
import mongoose from 'mongoose';
import { OtpModel } from '../models/otp.model.js';
import { generateOtp } from '../helper/otp.js';

export const BlogController = {
  getAllBlogsPage: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const fields = Object.keys(BlogModel.schema.paths).filter(
        (f) =>
          !['_id', '__v', 'createdAt', 'updatedAt'].includes(f) &&
          BlogModel.schema.paths[f].instance === 'String',
      );
      const query = search
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' },
            })),
          }
        : {};
      const [blogs, total] = await Promise.all([
        BlogModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        BlogModel.countDocuments(query),
      ]);
      const successMessage = req.session.successMessage;
      delete req.session.successMessage;
      return res.render('pages/blog', {
        blogs,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        search,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  },
  renderNewBlogForm: (req, res, next) => {
    try {
      return res.render('pages/new_blog');
    } catch (error) {
      return next(error);
    }
  },
  createOne: async (req, res, next) => {
    try {
      const body = req.validatedData;
      const data = await BlogModel.create(body);
      req.session.successMessage = `BLOG CREATED SUCCESSFULLY!`;
      return res.redirect(`/blog/${data._id}`);
    } catch (error) {
      return res.render('pages/new_blog', {
        error: error.message,
        blog: req.body,
      });
    }
  },
  getOneBlogPage: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await BlogModel.findOne({ _id: id });
      if (!data) {
        return res
          .status(404)
          .render('pages/error', { message: `Blog with ID: ${id} not found.` });
      }
      const successMessage = req.session.successMessage; 
      delete req.session.successMessage;
      return res.render('pages/one_blog', { data, successMessage });
    } catch (error) {
      if (error.name === 'CastError') {
        return res
          .status(404)
          .render('pages/error', { message: `Invalid Blog ID provided.` });
      }
      return next(error);
    }
  },
  renderEditBlogForm: async (req, res, next) => {
    try {
      const { id } = req.params;
      const blog = await BlogModel.findOne({ _id: id });
      if (!blog) {
        return res
          .status(404)
          .render('pages/error', {
            message: `Blog with ID: ${id} not found for editing.`,
          });
      }
      return res.render('pages/edit_blog', { blog });
    } catch (error) {
      if (error.name === 'CastError') {
        return res
          .status(404)
          .render('pages/error', {
            message: `Invalid Blog ID provided for editing.`,
          });
      }
      return next(error);
    }
  },
  updateOne: async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const { id } = req.params;
      const body = req.validatedData;
      const data = await BlogModel.findByIdAndUpdate(id, body, {
        new: true,
        session,
      });
      if (!data) {
        await session.abortTransaction();
        await session.endSession();
        return res
          .status(404)
          .render('pages/edit_blog', {
            error: `Blog with ID: ${id} not found for update.`,
            blog: { ...req.body, _id: id },
          });
      }
      if (req.user && req.user.email) {
        const otp = await generateOtp();
        await mailer(req.user.email, otp);
        await OtpModel.create([{ otp, user_id: req.user.id }], { session });
      }
      await session.commitTransaction();
      await session.endSession();
      req.session.successMessage = `SUCCESSFULLY UPDATED THE BLOG  ID:${id}!`;
      return res.redirect(`/blog/${data._id}`);
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      if (error.name === 'CastError') {
        return res
          .status(404)
          .render('pages/edit_blog', {
            error: `Invalid Blog ID provided for update.`,
            blog: { ...req.body, _id: req.params.id },
          });
      }
      return res.render('pages/edit_blog', {
        error: error.message,
        blog: { ...req.body, _id: req.params.id },
      });
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await BlogModel.findByIdAndDelete({ _id: id });
      if (!data) {
        return res
          .status(404)
          .render('pages/error', {
            message: `Blog with ID: ${id} not found for deletion.`,
          });
      }
      return res.redirect('/blog');
    } catch (error) {
      if (error.name === 'CastError') {
        return res
          .status(404)
          .render('pages/error', {
            message: `Invalid Blog ID provided for deletion.`,
          });
      }
      return next(error);
    }
  },
  renderHomePage: async (req, res, next) => {
    try {
      return res.render('pages/home', { error: null });
    } catch (error) {
      next(error);
      return res.redirect('pages/error');
    }
  },
  renderAboutPage: async (req, res, next) => {
    try {
      return res.render('pages/about', { error: null });
    } catch (error) {
      next(error);
      return res.redirect('pages/error', { message: error.message });
    }
  },
};