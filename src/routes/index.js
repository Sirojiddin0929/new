import { Router } from 'express';

import { blogRouter } from './blog.router.js';
import { BlogController } from '../controllers/blog.controller.js';


const MainRouter = Router();


MainRouter.use('/home', BlogController.renderHomePage)
MainRouter.use('/about', BlogController.renderAboutPage)
MainRouter.use('/blog', blogRouter);

export default MainRouter;