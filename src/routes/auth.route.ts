import express from 'express';
import {
  register,
  login,
  currentUser,
  logout,
  verifyEmail,
  resendOtpAndUpdateDB,
  updatePasswordWithOTP,
} from '../controllers/auth.controller';

import {
  loginValidator,
  registerValidator,
  verifyEmailValidator,
  logoutValidator,
  resendOtpAndUpdateDBValidator,
  updatePasswordWithOTPValidator,
} from '../validation/auth.validation';

import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

router.post('/register', registerValidator, register);

router.post('/login', loginValidator, login);

router.get('/current', verifyToken, currentUser);

router.post('/logout', verifyToken, logoutValidator, logout);

router.post('/verify-email', verifyEmailValidator, verifyEmail);

router.post('/resend-otp', resendOtpAndUpdateDBValidator, resendOtpAndUpdateDB);

router.post(
  '/update-password',
  updatePasswordWithOTPValidator,
  updatePasswordWithOTP,
);

export default router;
