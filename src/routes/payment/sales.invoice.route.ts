import express from 'express';
import {
  createSalesInvoice,
  getAllSalesInvoices,
  getSalesInvoiceById,
  updateSalesInvoice,
  deleteSalesInvoice,
  getSalesInvoicesByUserId,
  getSalesInvoicesByBoxId,
  getSalesInvoicesBySalesId,
} from '../../controllers/payment/sales.invoice.controller';

import {
  createSalesInvoiceValidation,
  deleteSalesInvoiceValidation,
  getSalesInvoiceByIdValidation,
  getSalesInvoicesByBoxIdValidation,
  getSalesInvoicesByUserIdValidation,
  updateSalesInvoiceValidation,
  getSalesInvoicesBySalesIdValidation,
} from '../../validation/payment/sales.invoice.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

// CRUD operations
router.post(
  '/new',
  verifyToken,
  createSalesInvoiceValidation,
  createSalesInvoice,
);
router.get('/get-all', verifyToken, getAllSalesInvoices);
router.get(
  '/get-one/:id',
  verifyToken,
  getSalesInvoiceByIdValidation,
  getSalesInvoiceById,
);
router.put(
  '/update/:id',
  verifyToken,
  updateSalesInvoiceValidation,
  updateSalesInvoice,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteSalesInvoiceValidation,
  deleteSalesInvoice,
);

// Additional operations
router.get(
  '/get-user-sales-invoices',
  verifyToken,
  getSalesInvoicesByUserIdValidation,
  getSalesInvoicesByUserId,
);

router.get(
  '/get-sales-sales-invoices',
  verifyToken,
  getSalesInvoicesBySalesIdValidation,
  getSalesInvoicesBySalesId,
);

router.get(
  '/get-box-sales-invoices',
  verifyToken,
  getSalesInvoicesByBoxIdValidation,
  getSalesInvoicesByBoxId,
);

export default router;
