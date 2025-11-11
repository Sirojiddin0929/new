import { Router } from 'express';
import { register, verifyOtp } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validations.js';
import { loginValidate } from '../validations/auth.validator.js';
import { login } from '../controllers/auth.controller.js';
import { registerValidate } from '../validations/auth.validator.js';
import { profile, createAdmin } from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/authGuard.js';
import { adminValidate } from '../validations/auth.validator.js';
import { loginAdmin } from '../controllers/auth.controller.js';


export const loginRouter = Router();
loginRouter.get('/', login.renderLogin)
loginRouter.post('/', validate(loginValidate), login.handleLogin);

export const registerRouter = Router();
registerRouter.get('/', register.renderRegister);
registerRouter.post('/', validate(registerValidate), register.handleRegister);

 
export const profileRouter = Router();
profileRouter.get('/', authGuard, profile);


export const verifyRouter = Router()
verifyRouter.post("/", authGuard, verifyOtp)

export const adminRouter = Router()
adminRouter.post("/register", validate(adminValidate), createAdmin)
adminRouter.post("/login", validate(loginValidate), loginAdmin)