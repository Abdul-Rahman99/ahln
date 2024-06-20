import express from 'express';
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from '../controllers/permission.controller';

import {
  createPermissionValidator,
  deletePermissionValidator,
  getPermissionValidator,
  updatePermissionValidator,
} from '../validation/permission.validation';

import verifyToken from '../middlewares/verifyToken';
import authorize from '../middlewares/authorize';

const router = express.Router();

router.post('/permission/new', createPermissionValidator, createPermission);
router.get(
  '/permission/get-all',
  verifyToken,
  authorize('admin', 'super admin'),
  getAllPermissions,
);
router.get(
  '/permission/get-one/:id',
  verifyToken,
  getPermissionValidator,
  getPermissionById,
);
router.put(
  '/permission/update/:id',
  verifyToken,
  authorize('admin', 'super admin'),
  updatePermissionValidator,
  updatePermission,
);
router.delete(
  '/permission/delete/:id',
  verifyToken,
  authorize('admin', 'super admin'),
  deletePermissionValidator,
  deletePermission,
);

export default router;
