import express from 'express';
import {
  createBoxLocker,
  getAllBoxLockers,
  getBoxLockerById,
  updateBoxLocker,
  deleteBoxLocker,
} from '../../controllers/box/box.locker.controller';
// import {
//   createBoxLockerValidator,
//   deleteBoxLockerValidator,
//   getBoxLockerValidator,
//   updateBoxLockerValidator,
// } from '../../validation/box/box.locker.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_box_locker']),
//   createBoxLockerValidator,
  createBoxLocker,
);

router.get(
  '/get-all',
  verifyToken,
  authorize(['read_box_locker']),
  getAllBoxLockers,
);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_box_locker']),
//   getBoxLockerValidator,
  getBoxLockerById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box_locker']),
//   updateBoxLockerValidator,
  updateBoxLocker,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box_locker']),
//   deleteBoxLockerValidator,
  deleteBoxLocker,
);

export default router;
