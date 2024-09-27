import { Router } from 'express';
import {
  createOfflineOTPs,
  getAllOfflineOTPs,
} from '../../controllers/delivery/offline.otps.controller';
import {
  createOfflineOTPsValidation,
  getOfflineOTPsByIdValidation,
} from '../../validation/delivery/offline.otps.validation';
const router = Router();

router.post('/create', createOfflineOTPsValidation, createOfflineOTPs);
router.get('/get-all/:box_id', getOfflineOTPsByIdValidation, getAllOfflineOTPs);

export default router;
