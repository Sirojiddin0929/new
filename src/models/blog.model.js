import { model, Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
    isPrivate: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true
    }
  },
  { timestamps: true },
);

const Blog = model('blog', blogSchema);
export default Blog;