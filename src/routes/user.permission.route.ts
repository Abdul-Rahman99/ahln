// src/routes/userPermission.routes.ts
import express from 'express';
import {
  assignPermissionToUser,
  removePermissionFromUser,
  getPermissionsByUser,
} from '../controllers/user.permission.controller';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post(
  '/assign',
  authorize(['create_user_permission']),
  assignPermissionToUser,
);
router.post(
  '/revoke',
  authorize(['delete_user_permission']),
  removePermissionFromUser,
);
router.get(
  '/:userId',
  authorize(['read_user_permission']),
  getPermissionsByUser,
);

export default router;
