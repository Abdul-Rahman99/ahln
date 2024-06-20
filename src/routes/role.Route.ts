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

// import verifyToken from '../middlewares/verifyToken';
// import authorize from '../middlewares/authorize';

const router = express.Router();

router.post('/new', createRoleValidator, createRole);
router.get(
  '/get-all',
  //   verifyToken,
  //   authorize('admin', 'super admin'),
  getAllRoles,
);
router.get('/get-one/:id', getRoleValidator, getRoleById);
router.put(
  '/update/:id',
  //   verifyToken,
  //   authorize('admin', 'super admin'),
  updateRoleValidator,
  updateRole,
);
router.delete(
  '/delete/:id',
  //   verifyToken,
  //   authorize('admin', 'super admin'),
  deleteRoleValidator,
  deleteRole,
);

export default router;
