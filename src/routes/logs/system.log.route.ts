import express from 'express';
import verifyToken from '../../middlewares/verifyToken';

import {
  createSystemLog,
  deleteSystemLogById,
  getAllSystemLogs,
  getSystemLogById,
  updateSystemLog,
} from '../../controllers/logs/system.log.controller';
import {
  createSystemLogByIdValidation,
  deleteSystemLogByIdValidation,
  getSystemLogByIdValidation,
  updateSystemLogByIdValidation,
} from '../../validation/logs/system.log.validation';
const router = express.Router();

router.post(
  '/new',
  verifyToken,
  createSystemLogByIdValidation,
  createSystemLog,
);
router.get('/get-all', verifyToken, getAllSystemLogs);
router.get(
  '/get-one/:id',
  verifyToken,
  getSystemLogByIdValidation,
  getSystemLogById,
);
router.put(
  '/update/:id',
  verifyToken,
  updateSystemLogByIdValidation,
  updateSystemLog,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteSystemLogByIdValidation,
  deleteSystemLogById,
);

export default router;
