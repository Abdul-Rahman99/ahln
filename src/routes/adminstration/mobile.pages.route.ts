import express from 'express';
import {
  createMobilePage,
  getAllMobilePages,
  getMobilePageById,
  updateMobilePage,
  deleteMobilePage,
} from '../../controllers/adminstration/mobile.pages.controller';
import {
  createMobilePageValidation,
  deleteMobilePageValidation,
  getMobilePageByIdValidation,
  updateMobilePageValidation,
} from '../../validation/adminstration/mobile.pages.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createMobilePageValidation, createMobilePage);
router.get('/get-all', verifyToken, getAllMobilePages);
router.get(
  '/get-one/:id',
  verifyToken,
  getMobilePageByIdValidation,
  getMobilePageById,
);
router.put(
  '/update/:id',
  verifyToken,
  updateMobilePageValidation,
  updateMobilePage,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteMobilePageValidation,
  deleteMobilePage,
);

export default router;
