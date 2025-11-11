import { model, Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
    post_id:{
      type: Schema.Types.ObjectId,
      ref: 'post'
    },
    content: {
      type: String,
      default: true,
      required: true,
      trim: true
    }
  },
  { timestamps: true },
);

export const Comment = model('comment', commentSchema);