import { Router } from 'express';

import {
  createRelativeCustomer,
  deleteRelativeCustomer,
  getAllRelativeCustomersByUserId,
  getAllRelativeCustomersForAdmin,
  getRelativeCustomerById,
  updateRelativeCustomer,
  updateRelativeCustomerStatus,
} from '../../controllers/user/relative.customer.controller';

import verifyToken from '../../middlewares/verifyToken';

const router = Router();

router.post('/new', verifyToken, createRelativeCustomer);
router.get('/get-all', verifyToken, getAllRelativeCustomersByUserId);
router.get('/get-all-admin', verifyToken, getAllRelativeCustomersForAdmin);
router.get('/get-one/:id', verifyToken, getRelativeCustomerById);
router.put('/update/:id', verifyToken, updateRelativeCustomer);
router.delete('/delete/:id', verifyToken, deleteRelativeCustomer);

router.put('/update-status', verifyToken, updateRelativeCustomerStatus);
export default router;
