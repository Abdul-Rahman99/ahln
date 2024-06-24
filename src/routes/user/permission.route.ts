import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from '../../controllers/user/permission.controller';

import {
  createPermissionValidator,
  deletePermissionValidator,
  getPermissionValidator,
  updatePermissionValidator,
} from '../../validation/user/permission.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_permission']),
  createPermissionValidator,
  createPermission,
);
router.get(
  '/get-all',
  verifyToken,
  authorize(['read_permission']),
  getAllPermissions,
);
router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_permission']),
  getPermissionValidator,
  getPermissionById,
);
router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_permission']),
  updatePermissionValidator,
  updatePermission,
);
router.delete(
  '/permission/delete/:id',
  verifyToken,
  authorize(['delete_permission']),
  deletePermissionValidator,
  deletePermission,
);

export default router;
