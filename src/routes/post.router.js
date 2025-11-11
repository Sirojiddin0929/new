import { Router } from 'express';
import { validate } from '../middleware/validations.js';

import {
  postValidate,
  postUpdate,
} from '../validations/post.validator.js';
import {PostController} from '../controllers/post.controller.js';

const router = Router();

router.get('/',  PostController.getAll);
router.get('/:id', PostController.getOne);
router.post('/',  validate(postValidate), PostController.createOne);
router.put('/:id',  validate(postUpdate), PostController.updateOne);
router.delete('/:id', PostController.deleteOne);

export { router as postRouter };