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
} from '../../controllers/box/user.box.controller';

import {
  assignBoxToUserValidation,
  createUserBoxValidation,
  deleteUserBoxValidation,
  getUserBoxByIdValidation,
  getUserBoxesByBoxIdValidation,
  getUserBoxesByUserIdValidation,
  updateUserBoxValidation,
} from '../../validation/box/user.box.validation';

const router = express.Router();

// CRUD operations
router.post('/new', createUserBoxValidation, createUserBox);
router.get('/get-all', getAllUserBoxes);
router.get('/get-one/:id', getUserBoxByIdValidation, getUserBoxById);
router.put('/update/:id', updateUserBoxValidation, updateUserBox);
router.delete('/delete/:id', deleteUserBoxValidation, deleteUserBox);

// Additional operations
router.get(
  '/get-user-boxes',
  getUserBoxesByUserIdValidation,
  getUserBoxesByUserId,
);
router.get(
  '/get-boxes-user',
  getUserBoxesByBoxIdValidation,
  getUserBoxesByBoxId,
);
router.post('/assign-box-to-user', assignBoxToUserValidation, assignBoxToUser);

export default router;
