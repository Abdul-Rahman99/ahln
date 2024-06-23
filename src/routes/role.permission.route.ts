// src/routes/rolePermission.routes.ts
import express from 'express';
import {
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsByRole,
} from '../controllers/role.permission.controller';
import { authorize } from '../middlewares/authorize';
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

router.post(
  '/assign',
  verifyToken,
  authorize(['create_role_permission']),
  assignPermissionToRole,
);
router.post(
  '/revoke',
  verifyToken,
  authorize(['delete_role_permission']),
  removePermissionFromRole,
);
router.get(
  '/:roleId',
  verifyToken,
  authorize(['read_role_permission']),
  getPermissionsByRole,
);

export default router;
