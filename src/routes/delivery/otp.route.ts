import { Router } from 'express';
import {
  createOTP,
  getAllOTPs,
  getOTPById,
  updateOTP,
  deleteOTP,
  getOTPsByUser,
  checkOTP,
} from '../../controllers/delivery/otp.controller';

const router = Router();

router.post('/new', createOTP);
router.get('/get-all', getAllOTPs);
router.get('/get-one/:id', getOTPById);
router.put('/update/:id', updateOTP);
router.delete('/delete/:id', deleteOTP);
router.get('/user-otp/:userId', getOTPsByUser);
router.post('/check-otp', checkOTP);

export default router;
