import { model, Schema } from 'mongoose';

const likeSchema = new Schema(
  {
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
    post_id:{
      type: Schema.Types.ObjectId,
      ref: 'post'
    },
    comment_id:{
      type: Schema.Types.ObjectId,
      ref: 'comment'
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true },
);

export const Like = model('like', likeSchema);