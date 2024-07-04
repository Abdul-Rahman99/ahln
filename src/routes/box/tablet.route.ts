import express from 'express';
import {
  createTablet,
  getAllTablets,
  getTabletById,
  updateTablet,
  deleteTablet,
} from '../../controllers/box/tablet.controller';

import {
  createTabletValidation,
  deleteTabletValidation,
  getTabletByIdValidation,
  updateTabletValidation,
} from '../../validation/box/tablet.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_tablet']),
  createTabletValidation,
  createTablet,
);

router.get('/get-all', verifyToken, authorize(['read_tablet']), getAllTablets);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_tablet']),
  getTabletByIdValidation,
  getTabletById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_tablet']),
  updateTabletValidation,
  updateTablet,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_tablet']),
  deleteTabletValidation,
  deleteTablet,
);

export default router;
