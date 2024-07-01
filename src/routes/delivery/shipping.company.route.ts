// shippingCompany.routes.ts

import express from 'express';
import {
  createShippingCompany,
  getAllShippingCompanies,
  getShippingCompanyById,
  updateShippingCompany,
  deleteShippingCompany,
} from '../../controllers/delivery/shipping.company.controller';

const router = express.Router();

router.post('/new', createShippingCompany);
router.get('/get-all', getAllShippingCompanies);
router.get('/get-one/:id', getShippingCompanyById);
router.put('/update/:id', updateShippingCompany);
router.delete('/delete/:id', deleteShippingCompany);

export default router;
