import express from 'express';
import {
  createAboutUs,
  deleteAboutUs,
  getAboutUsById,
  getAllAboutUs,
  updateAboutUs,
} from '../../controllers/adminstration/about.us.controller';
import {
  createAboutUsValidation,
  deleteAboutUsValidation,
  getAboutUsByIdValidation,
  updateAboutUsValidation,
} from '../../validation/adminstration/about.us.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createAboutUsValidation, createAboutUs);
router.get('/get-all', getAllAboutUs);
router.get('/get-one/:id', getAboutUsByIdValidation, getAboutUsById);
router.put('/update/:id', verifyToken, updateAboutUsValidation, updateAboutUs);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteAboutUsValidation,
  deleteAboutUs,
);

export default router;
