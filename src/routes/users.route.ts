import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';
import verifyToken from '../lib/middlewares/verifyToken';
import authorize from '../lib/middlewares/authorize';

const router = express.Router();

router.post('/new', createUser);
router.get(
  '/get-all',
  verifyToken,
  authorize('admin', 'super admin', 'delivery'),
  getAllUsers,
);

router.get('/get-one/:id', verifyToken, getUserById);

router.put(
  '/update/:id',
  verifyToken,
  authorize('admin', 'super admin'),
  updateUser,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize('admin', 'super admin'),
  deleteUser,
);

export default router;
