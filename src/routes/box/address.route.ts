import express from 'express';
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from '../../controllers/box/address.controller';
// import {
//   createAddressValidator,
//   deleteAddressValidator,
//   getAddressValidator,
//   updateAddressValidator,
// } from '../../validation/address/address.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_box']),
  //   createAddressValidator,
  createAddress,
);

router.get('/get-all', verifyToken, authorize(['read_box']), getAllAddresses);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_box']),
  //   getAddressValidator,
  getAddressById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box']),
  //   updateAddressValidator,
  updateAddress,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box']),
  //   deleteAddressValidator,
  deleteAddress,
);

export default router;
