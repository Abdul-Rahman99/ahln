import { Router } from 'express';
import {
  createOTP,
  getAllOTPs,
  getOTPById,
  updateOTP,
  deleteOTP,
} from '../../controllers/delivery/otp.controller';

const router = Router();

router.post('/new', createOTP);
router.get('/get-all', getAllOTPs);
router.get('/get-one/:id', getOTPById);
router.put('/update/:id', updateOTP);
router.delete('/delete/:id', deleteOTP);

export default router;
