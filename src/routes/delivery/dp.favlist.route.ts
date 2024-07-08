import express from 'express';
import {
  createDPFavList,
  deleteDPFavList,
  getDPFavListsByUser,
} from '../../controllers/delivery/dp.favlist.controller';
import {
  createDPFavListValidation,
  deleteDPFavListValidation,
  getDPFavListValidation,
} from '../../validation/delivery/dp.favlist.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createDPFavListValidation, createDPFavList);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteDPFavListValidation,
  deleteDPFavList,
);
router.get('/user', verifyToken, getDPFavListValidation, getDPFavListsByUser);

export default router;
