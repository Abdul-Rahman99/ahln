import express from 'express';
import {
  register,
  login,
  currentUser,
  logout,
  verifyEmail,
  resendOtpAndUpdateDB,
  updatePasswordWithOTP,
  // resetPassword,
  // validateResetPassword,
} from '../controllers/auth.controller';
import verifyToken from '../middlewares/verifyToken';
// import { sendVerificationEmail } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/current', verifyToken, currentUser);

router.post('/logout', verifyToken, logout);

router.post('/verify-email', verifyEmail);

router.post('/resend-otp', resendOtpAndUpdateDB);

router.post('/update-password', updatePasswordWithOTP);

export default router;
