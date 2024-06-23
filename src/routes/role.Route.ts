import express from 'express';
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controllers/role.controller';

import {
  createRoleValidator,
  deleteRoleValidator,
  getRoleValidator,
  updateRoleValidator,
} from '../validation/role.validation';

import verifyToken from '../middlewares/verifyToken';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_role']),
  createRoleValidator,
  createRole,
);
router.get('/get-all', verifyToken, authorize(['read_role']), getAllRoles);
router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_role']),
  getRoleValidator,
  getRoleById,
);
router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_role']),
  updateRoleValidator,
  updateRole,
);
router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_role']),
  deleteRoleValidator,
  deleteRole,
);

export default router;
