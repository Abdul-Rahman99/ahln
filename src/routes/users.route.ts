import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';

import {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from '../validation/user.validation';

import verifyToken from '../middlewares/verifyToken';
import authorize from '../middlewares/authorize';

const router = express.Router();

router.post('/new', createUserValidator, createUser);
router.get(
  '/get-all',
  verifyToken,
  authorize('admin', 'super admin', 'delivery'),
  getAllUsers,
);

router.get('/get-one/:id', verifyToken, getUserValidator, getUserById);

router.put(
  '/update/:id',
  verifyToken,
  authorize('admin', 'super admin'),
  updateUserValidator,
  updateUser,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize('admin', 'super admin'),
  deleteUserValidator,
  deleteUser,
);

export default router;
