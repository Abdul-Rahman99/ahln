import express from 'express';

import {
  createCity,
  deleteCity,
  getAllCity,
  getOneCity,
  updateCity,
  getCityByCountry,
} from '../../controllers/adminstration/city.controller';
import {
  createCityValidation,
  deleteCityValidation,
  getCityByIdValidation,
  updateCityValidation,
} from '../../validation/adminstration/city.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createCityValidation, createCity);
router.get('/get-all', verifyToken, getAllCity);
router.get('/get-all-in-country/:id', verifyToken, getCityByCountry);
router.get('/get-one/:id', verifyToken, getCityByIdValidation, getOneCity);
router.put('/update/:id', verifyToken, updateCityValidation, updateCity);
router.delete('/delete/:id', verifyToken, deleteCityValidation, deleteCity);

export default router;
