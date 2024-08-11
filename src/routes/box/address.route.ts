import express from 'express';
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from '../../controllers/box/address.controller';

import {
  createAddressValidation,
  deleteAddressValidation,
  getAddressByIdValidation,
  updateAddressValidation,
} from '../../validation/box/address.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  // authorize(['create_box']),
  createAddressValidation,
  createAddress,
);

router.get('/get-all', verifyToken, authorize(['read_box']), getAllAddresses);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_box']),
  getAddressByIdValidation,
  getAddressById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box']),
  updateAddressValidation,
  updateAddress,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box']),
  deleteAddressValidation,
  deleteAddress,
);

export default router;
