import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from '../../controllers/payment/payment.controller';

import {
  createPaymentValidation,
  getPaymentByIdValidation,
  updatePaymentValidation,
  deletePaymentValidation,
} from '../../validation/payment/payment.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

// CRUD operations
router.post('/new', verifyToken, createPaymentValidation, createPayment);
router.get('/get-all', verifyToken, getAllPayments);
router.get(
  '/get-one/:id',
  verifyToken,
  getPaymentByIdValidation,
  getPaymentById,
);
router.put('/update/:id', verifyToken, updatePaymentValidation, updatePayment);
router.delete(
  '/delete/:id',
  verifyToken,
  deletePaymentValidation,
  deletePayment,
);

export default router;
