// src/routes/userPermission.routes.ts
import express from 'express';
import {
  assignPermissionToUser,
  removePermissionFromUser,
  getPermissionsByUser,
  getAllPermissions,
} from '../../controllers/user/user.permission.controller';
import { authorize } from '../../middlewares/authorize';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post(
  '/assign',
  verifyToken,
  authorize(['create_user_permission']),
  assignPermissionToUser,
);
router.post(
  '/revoke',
  verifyToken,
  authorize(['delete_user_permission']),
  removePermissionFromUser,
);
router.get(
  '/:userId',
  verifyToken,
  authorize(['read_user_permission']),
  getPermissionsByUser,
);
router.get(
  '/get-all',
  verifyToken,
  authorize(['read_user_permission']),
  getAllPermissions,
);

export default router;
