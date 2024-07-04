import { Router } from 'express';
import {
  createDeliveryPackage,
  getAllDeliveryPackages,
  getDeliveryPackageById,
  updateDeliveryPackage,
  deleteDeliveryPackage,
  getUserDeliveryPackages,
} from '../../controllers/delivery/delivery.package.controller';

import verifyToken from '../../middlewares/verifyToken';

import {
  createDeliveryPackageValidation,
  deleteDeliveryPackageValidation,
  getDeliveryPackageByIdValidation,
  updateDeliveryPackageValidation,
  getUserDeliveryPackagesValidation,
} from '../../validation/delivery/delivery.package.validation';
// import { authorize } from '../../middlewares/authorize';

const router = Router();

router.post(
  '/new',
  verifyToken,
  createDeliveryPackageValidation,
  createDeliveryPackage,
);
router.get('/get-all', verifyToken, getAllDeliveryPackages);
router.get(
  '/get-one/:id',
  verifyToken,
  getDeliveryPackageByIdValidation,
  getDeliveryPackageById,
);
router.put(
  '/update/:id',
  verifyToken,
  updateDeliveryPackageValidation,
  updateDeliveryPackage,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteDeliveryPackageValidation,
  deleteDeliveryPackage,
);

router.get(
  '/user/delivery-packages/',
  getUserDeliveryPackagesValidation,
  getUserDeliveryPackages,
);

export default router;
