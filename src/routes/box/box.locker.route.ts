import express from 'express';
import {
  createBoxLocker,
  getAllBoxLockers,
  getBoxLockerById,
  updateBoxLocker,
  deleteBoxLocker,
  getAllLockersById,
} from '../../controllers/box/box.locker.controller';
import {
  createBoxLockerValidation,
  deleteBoxLockerValidation,
  getBoxLockerByIdValidation,
  updateBoxLockerValidation,
} from '../../validation/box/box.locker.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_box_locker']),
  createBoxLockerValidation,
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
  getBoxLockerByIdValidation,
  getBoxLockerById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box_locker']),
  updateBoxLockerValidation,
  updateBoxLocker,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box_locker']),
  deleteBoxLockerValidation,
  deleteBoxLocker,
);

router.post('/get-lockers-by-box', getAllLockersById);
export default router;
