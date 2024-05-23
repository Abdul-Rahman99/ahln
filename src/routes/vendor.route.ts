import express from 'express';

import {
  createVendor,
  deleteVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
} from '../controllers/vendor.controller';

const router = express.Router();

router.post('/new', createVendor);

router.get('/get-all', getAllVendors);

router.get('/get-one/:id', getVendorById);

router.put('/update/:id', updateVendor);

router.delete('/delete/:id', deleteVendor);

export default router;
