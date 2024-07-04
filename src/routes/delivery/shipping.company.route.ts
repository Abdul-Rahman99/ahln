// shippingCompany.routes.ts

import express from 'express';
import {
  createShippingCompany,
  getAllShippingCompanies,
  getShippingCompanyById,
  updateShippingCompany,
  deleteShippingCompany,
} from '../../controllers/delivery/shipping.company.controller';

import verifyToken from '../../middlewares/verifyToken';
import {
  createShippingCompanyValidation,
  deleteShippingCompanyIdValidation,
  getShippingCompanyIdValidation,
  updateShippingCompanyValidation,
} from '../../validation/delivery/shipping.company.validation';
const router = express.Router();

router.post(
  '/new',
  verifyToken,
  createShippingCompanyValidation,
  createShippingCompany,
);
router.get('/get-all', verifyToken, getAllShippingCompanies);
router.get(
  '/get-one/:id',
  verifyToken,
  getShippingCompanyIdValidation,
  getShippingCompanyById,
);
router.put(
  '/update/:id',
  verifyToken,
  updateShippingCompanyValidation,
  updateShippingCompany,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteShippingCompanyIdValidation,
  deleteShippingCompany,
);

export default router;
