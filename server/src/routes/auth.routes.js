import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, credentialsLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordRules,
  loginRules,
  registerRules,
  updateProfileRules,
} from '../validators/auth.validator.js';

const router = Router();

router.use(authLimiter);

router.post('/register', credentialsLimiter, validate(registerRules), authController.register);
router.post('/login', credentialsLimiter, validate(loginRules), authController.login);

router.get('/me', protect, authController.getMe);
router.put('/profile', protect, validate(updateProfileRules), authController.updateProfile);
router.put(
  '/password',
  credentialsLimiter,
  protect,
  validate(changePasswordRules),
  authController.changePassword,
);

export default router;
