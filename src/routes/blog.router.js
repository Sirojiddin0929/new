import { Router } from 'express';
import { validate } from '../middleware/validation.js';
import { blogValidate, blogUpdate} from '../validations/blog.validator.js';
import {BlogController} from '../controllers/blog.controller.js';

const router = Router();

router.get('/', BlogController.getAllBlogsPage); 
router.get('/new', BlogController.renderNewBlogForm);
router.get('/:id', BlogController.getOneBlogPage); 
router.post('/', validate(blogValidate), BlogController.createOne);
router.get('/:id/edit', BlogController.renderEditBlogForm); 
router.put('/:id', validate(blogUpdate), BlogController.updateOne); 
router.delete('/:id', BlogController.deleteOne); 

export { router as blogRouter };