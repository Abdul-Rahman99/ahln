import { Router } from 'express';
import {
  createDeliveryPackage,
  getAllDeliveryPackages,
  getDeliveryPackageById,
  updateDeliveryPackage,
  deleteDeliveryPackage,
  getUserDeliveryPackages,
} from '../../controllers/delivery/delivery.package.controller';

const router = Router();

router.post('/new', createDeliveryPackage);
router.get('/get-all', getAllDeliveryPackages);
router.get('/get-one/:id', getDeliveryPackageById);
router.put('/update/:id', updateDeliveryPackage);
router.delete('/delete/:id', deleteDeliveryPackage);

router.get('/user/delivery-packages', getUserDeliveryPackages);

export default router;
