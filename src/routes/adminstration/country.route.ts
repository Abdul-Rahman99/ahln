import express from 'express';

import {
  createCountry,
  deleteCountry,
  getAllCountry,
  getOneCountry,
  updateCountry,
} from '../../controllers/adminstration/country.controller';
import {
  createCountryValidation,
  deleteCountryValidation,
  getCountryByIdValidation,
  updateCountryValidation,
} from '../../validation/adminstration/country.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createCountryValidation, createCountry);
router.get('/get-all', verifyToken, getAllCountry);
router.get(
  '/get-one/:id',
  verifyToken,
  getCountryByIdValidation,
  getOneCountry,
);
router.put('/update/:id', verifyToken, updateCountryValidation, updateCountry);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteCountryValidation,
  deleteCountry,
);

export default router;
