import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';

import {
  // createUserValidator,
  deleteUserValidator,
  getUserValidator,
  // updateUserValidator,
} from '../validation/user.validation';

import verifyToken from '../middlewares/verifyToken';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_user']),
  // createUserValidator,
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
  '/update/:id',
  // verifyToken,
  // authorize(['update_user']),
  // updateUserValidator,
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
