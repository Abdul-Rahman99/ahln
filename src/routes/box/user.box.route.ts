import express from 'express';
import {
  createUserBox,
  getAllUserBoxes,
  getUserBoxById,
  updateUserBox,
  deleteUserBox,
  getUserBoxesByUserId,
  getUserBoxesByBoxId,
  assignBoxToUser,
  userAssignBoxToHimself,
  userAssignBoxToRelativeUser,
  updateUserBoxStatus,
} from '../../controllers/box/user.box.controller';

import {
  assignBoxToUserValidation,
  createUserBoxValidation,
  deleteUserBoxValidation,
  getUserBoxByIdValidation,
  getUserBoxesByBoxIdValidation,
  getUserBoxesByUserIdValidation,
  updateUserBoxValidation,
  userAssignBoxToHimselfValidation,
  userAssignBoxToRelativeUserValidation,
  updateUserBoxStatusValidation,
} from '../../validation/box/user.box.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

// CRUD operations
router.post('/new', verifyToken, createUserBoxValidation, createUserBox);
router.get('/get-all', verifyToken, getAllUserBoxes);
router.get(
  '/get-one/:id',
  verifyToken,
  getUserBoxByIdValidation,
  getUserBoxById,
);
router.put('/update/:id', verifyToken, updateUserBoxValidation, updateUserBox);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteUserBoxValidation,
  deleteUserBox,
);

// Additional operations
router.get(
  '/get-user-boxes',
  verifyToken,
  getUserBoxesByUserIdValidation,
  getUserBoxesByUserId,
);
router.get(
  '/get-boxes-user',
  verifyToken,
  getUserBoxesByBoxIdValidation,
  getUserBoxesByBoxId,
);
router.post(
  '/assign-box-to-user',
  verifyToken,
  assignBoxToUserValidation,
  assignBoxToUser,
);

router.post(
  '/user-assign-box-to-himself',
  verifyToken,
  userAssignBoxToHimselfValidation,
  userAssignBoxToHimself,
);

router.post(
  '/user-assign-box-to-relative-user',
  verifyToken,
  userAssignBoxToRelativeUserValidation,
  userAssignBoxToRelativeUser,
);

router.put(
  '/update-box-status/:id?',
  verifyToken,
  updateUserBoxStatusValidation,
  updateUserBoxStatus,
);

export default router;
