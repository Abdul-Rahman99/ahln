import express from 'express';
import {
//   registerDevice,
  deleteDevice,
  updateDevice,
  getDevicesByUser,
//   getUserDeviceById,
} from '../../controllers/user/user.device.controller';

import {
//   registerDeviceValidator,
  deleteDeviceValidator,
  updateDeviceValidator,
//   getOneUserDeviceValidator,
  getDevicesByUserValidator,
} from '../../validation/user/user.device.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

// Register a new device
// router.post(
//   '/new',
//   verifyToken,
//   authorize(['create_user']),
//   registerDeviceValidator,
//   registerDevice,
// );

// Delete a device by ID
router.delete(
  '/delete/:deviceId',
  verifyToken,
  authorize(['delete_user']),
  deleteDeviceValidator,
  deleteDevice,
);

// Update a device by ID
router.put(
  '/update/:deviceId',
  verifyToken,
  authorize(['update_user']),
  updateDeviceValidator,
  updateDevice,
);

// Get a device by ID
// router.put(
//   '/get-one/:deviceId',
//   verifyToken,
//   authorize(['read_user']),
//   getOneUserDeviceValidator,
//   getUserDeviceById,
// );

// Get all devices for a user
router.get(
  '/get-all/:userId',
  verifyToken,
  authorize(['read_user']),
  getDevicesByUserValidator,
  getDevicesByUser,
);

export default router;
