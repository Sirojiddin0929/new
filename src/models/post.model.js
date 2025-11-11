import { text } from 'express';
import { Schema, model } from 'mongoose';

const  PostSchema = new Schema(
  {
    title: { type: String, required: true,  trim: true },
    
    description: {type: String, trim: true},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
    
    status: {
      type: String,
      enum: ['draft', 'sent', 'archived'],
      default: 'draft'
    }
  },
  { timestamps: true },
);

const PostModel= model('post', PostSchema);

export default PostModel;