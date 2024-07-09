import express from 'express';
import verifyToken from '../../middlewares/verifyToken';

import {
  deleteAuditTrailById,
  getAllAuditTrail,
  getAuditTrailById,
} from '../../controllers/logs/audit.trail.controller';
import {
  deleteTrailByIdValidation,
  getAuditTrailByIdValidation,
} from '../../validation/logs/audit.trail.validation';
const router = express.Router();

router.get('/get-all', verifyToken, getAllAuditTrail);
router.get(
  '/get-one',
  verifyToken,
  getAuditTrailByIdValidation,
  getAuditTrailById,
);
router.get(
  '/delete/:id',
  verifyToken,
  deleteTrailByIdValidation,
  deleteAuditTrailById,
);

export default router;
