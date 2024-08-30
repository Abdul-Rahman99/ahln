import express from 'express';
import {
  createUserGuide,
  deleteUserGuide,
  getUserGuideById,
  getAllUserGuide,
  updateUserGuide,
} from '../../controllers/adminstration/user.guide.controller';
import {
  createUserGuideValidation,
  deleteUserGuideValidation,
  getUserGuideByIdValidation,
  updateUserGuideValidation,
} from '../../validation/adminstration/user.guide.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createUserGuideValidation, createUserGuide);
router.get('/get-all', verifyToken, getAllUserGuide);
router.get(
  '/get-one/:id',
  verifyToken,
  getUserGuideByIdValidation,
  getUserGuideById,
);
router.put('/update/:id', verifyToken, updateUserGuideValidation, updateUserGuide);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteUserGuideValidation,
  deleteUserGuide,
);

export default router;
