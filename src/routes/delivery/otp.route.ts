import { Router } from 'express';
import {
  createOTP,
  getAllOTPs,
  getOTPById,
  updateOTP,
  deleteOTP,
<<<<<<< HEAD
  getOTPsByUser,
  checkOTP,
=======
>>>>>>> ce58a39bd331e5af6e237f641e42a06c0bd628f6
} from '../../controllers/delivery/otp.controller';

const router = Router();

router.post('/new', createOTP);
router.get('/get-all', getAllOTPs);
router.get('/get-one/:id', getOTPById);
router.put('/update/:id', updateOTP);
router.delete('/delete/:id', deleteOTP);
<<<<<<< HEAD
router.get('/user-otp/:userId', getOTPsByUser);
router.post('/check-otp', checkOTP);
=======
>>>>>>> ce58a39bd331e5af6e237f641e42a06c0bd628f6

export default router;
