import express from 'express';
import {
  createMobilePage,
  getAllMobilePages,
  getMobilePageByTitle,
  updateMobilePage,
  deleteMobilePage,
} from '../../controllers/adminstration/mobile.pages.controller';
import {
  createMobilePageValidation,
  deleteMobilePageValidation,
  getMobilePageByTitleValidation,
  updateMobilePageValidation,
} from '../../validation/adminstration/mobile.pages.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createMobilePageValidation, createMobilePage);
router.get('/get-all', getAllMobilePages);
router.post('/get-one', getMobilePageByTitleValidation, getMobilePageByTitle);
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
