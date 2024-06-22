// src/routes/rolePermission.routes.ts
import express from 'express';
import {
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsByRole,
} from '../controllers/role.permission.controller';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post(
  '/assign',
  authorize(['create_role_permission']),
  assignPermissionToRole,
);
router.post(
  '/revoke',
  authorize(['delete_role_permission']),
  removePermissionFromRole,
);
router.get(
  '/:roleId',
  authorize(['read_role_permission']),
  getPermissionsByRole,
);

export default router;
