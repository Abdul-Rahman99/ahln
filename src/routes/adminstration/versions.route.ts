import express from 'express';

import {
  createVersions,
  deleteVersions,
  getAllVersions,
  getOneVersions,
  updateVersions,
} from '../../controllers/adminstration/versions.controller';
import {
  createVersionsValidation,
  deleteVersionsValidation,
  updateVersionsValidation,
  getVersionsByIdValidation,
} from '../../validation/adminstration/versions.validation';

import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createVersionsValidation, createVersions);
router.get('/get-all', verifyToken, getAllVersions);
router.get(
  '/get-one/:id',
  verifyToken,
  getVersionsByIdValidation,
  getOneVersions,
);
router.put(
  '/update/:id',
  verifyToken,
  updateVersionsValidation,
  updateVersions,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteVersionsValidation,
  deleteVersions,
);

export default router;
