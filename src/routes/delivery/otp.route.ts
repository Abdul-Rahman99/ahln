import { Router } from 'express';
import {
  createOTP,
  getAllOTPs,
  getOTPById,
  updateOTP,
  deleteOTP,
  // getOTPsByUser,
  checkOTP,
  checkTrackingNumberAndUpdateStatus,
} from '../../controllers/delivery/otp.controller';

import {
  checkOTPValidation,
  checkTrackingNumberValidation,
  createOTPValidation,
  deleteOTPValidation,
  getOTPByIdValidation,
  // getOTPsByUserValidation,
  updateOTPValidation,
} from '../../validation/delivery/otp.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = Router();

router.post('/new', verifyToken, createOTPValidation, createOTP);
router.get('/get-all', getAllOTPs);
router.get('/get-one/:id', getOTPByIdValidation, getOTPById);
router.put('/update/:id', updateOTPValidation, updateOTP);
router.delete('/delete/:id', deleteOTPValidation, deleteOTP);
// router.get('/user-otp/:userId', getOTPsByUserValidation, getOTPsByUser); //not used for stage 1
router.post('/check-otp', checkOTPValidation, checkOTP);
router.post(
  '/check-tracking-number',
  checkTrackingNumberValidation,
  checkTrackingNumberAndUpdateStatus,
);

export default router;
