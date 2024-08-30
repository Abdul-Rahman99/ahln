// src/routes/rolePermission.routes.ts
import express from 'express';
import {
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsByRole,
  getAllRolePermissions,
} from '../../controllers/user/role.permission.controller';
import { authorize } from '../../middlewares/authorize';
import verifyToken from '../../middlewares/verifyToken';

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
  '/get-one/:roleId',
  verifyToken,
  authorize(['read_role_permission']),
  getPermissionsByRole,
);

router.get(
  '/get-all',
  verifyToken,
  authorize(['read_role_permission']),
  getAllRolePermissions,
);

export default router;
