import { Router } from 'express';

import {
  createRelativeCustomer,
  deleteRelativeCustomer,
  getAllRelativeCustomersByUserId,
  getAllRelativeCustomersForAdmin,
  getRelativeCustomerAccess,
  updateRelativeCustomer,
  updateRelativeCustomerAccess,
  updateRelativeCustomerStatus,
} from '../../controllers/user/relative.customer.controller';

import verifyToken from '../../middlewares/verifyToken';

const router = Router();

router.post('/new', verifyToken, createRelativeCustomer);
router.get('/get-all/:boxId?', verifyToken, getAllRelativeCustomersByUserId);
router.get('/get-all-admin', verifyToken, getAllRelativeCustomersForAdmin);
router.put('/update/:id', verifyToken, updateRelativeCustomer);
router.delete('/delete/:id', verifyToken, deleteRelativeCustomer);

router.put('/update-status', verifyToken, updateRelativeCustomerStatus);

router.get(
  '/get-relative-customer-access/:box_id',
  verifyToken,
  getRelativeCustomerAccess,
);

router.put(
  '/update-relative-customer-access/:id',
  verifyToken,
  updateRelativeCustomerAccess,
);

export default router;
