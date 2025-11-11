import { Router } from 'express';
import { validate } from '../middleware/validations.js';
import { authGuard} from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import {
  userUpdate,
  userValidate
} from '../validations/user.validator.js';
import { UserController} from '../controllers/user.controller.js';

const router = Router();

router.get('/', authGuard, roleGuard( 'admin', 'user'), UserController.getAll);
router.get('/:id', authGuard, roleGuard('admin', 'user'), UserController.getOne);
router.post('/',   validate(userValidate), UserController.createOne);
router.put('/:id',  authGuard, roleGuard('user', 'admin'), validate(userUpdate), UserController.updateOne);
router.delete('/:id', authGuard, roleGuard('admin', 'user'), UserController.deleteOne);

export { router as userRouter };