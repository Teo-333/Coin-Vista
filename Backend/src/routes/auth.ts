import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

export default authRouter;