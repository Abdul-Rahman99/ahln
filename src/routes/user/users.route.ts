import express from 'express';
import {
  createUser,
  getAllUsers,
  getAllCustomers,
  getAllRelativeCustomers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../../controllers/user/users.controller';

import {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserStatusValidator,
  updateUserValidator,
} from '../../validation/user/user.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

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
  '/get-all-customers',
  verifyToken,
  authorize(['read_user']),
  getAllCustomers,
);
router.get(
  '/get-all-relative-customers',
  verifyToken,
  authorize(['read_user']),
  getAllRelativeCustomers,
);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_user']),
  getUserValidator,
  getUserById,
);

router.put(
  '/update/:userId?',
  verifyToken,
  // authorize(['update_user']),
  updateUserValidator,
  updateUser,
);

router.put(
  '/update-user-status/:userId?',
  verifyToken,
  // authorize(['update_user']),
  updateUserStatusValidator,
  updateUserStatus,
);

router.delete(
  '/delete/:userId',
  verifyToken,
  authorize(['delete_user']),
  deleteUserValidator,
  deleteUser,
);

export default router;
