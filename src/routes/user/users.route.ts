import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../../controllers/user/users.controller';

import {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from '../../validation/user/user.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';
import { uploadUserImage } from '../../controllers/auth.controller';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_user']),
  createUserValidator,
  createUser,
);

router.get('/get-all', verifyToken, authorize(['read_user']), getAllUsers);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_user']),
  getUserValidator,
  getUserById,
);

router.put(
  '/update',
  verifyToken,
  // authorize(['update_user']),
  uploadUserImage,
  updateUserValidator,
  updateUser,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_user']),
  deleteUserValidator,
  deleteUser,
);

export default router;
