import express from 'express';
import {
  createDPFavList,
  deleteDPFavList,
  getDPFavListsByUser,
} from '../../controllers/delivery/dp.favlist.controller';
import { createDPFavListValidation } from '../../validation/delivery/dp.favlist.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

router.post('/new', verifyToken, createDPFavListValidation, createDPFavList);
router.delete('/delete/:id', verifyToken, deleteDPFavList);
router.get('/user', verifyToken, getDPFavListsByUser);

export default router;
