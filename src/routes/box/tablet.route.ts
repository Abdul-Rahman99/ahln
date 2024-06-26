import express from 'express';
import {
  createTablet,
  getAllTablets,
  getTabletById,
  updateTablet,
  deleteTablet,
} from '../../controllers/box/tablet.controller';

import {
  // createTabletValidator,
  deleteTabletValidator,
  getTabletValidator,
  updateTabletValidator,
} from '../../validation/box/tablet.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_tablet']),
  // createTabletValidator,
  createTablet,
);

router.get('/get-all', verifyToken, authorize(['read_tablet']), getAllTablets);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_tablet']),
  getTabletValidator,
  getTabletById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_tablet']),
  updateTabletValidator,
  updateTablet,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_tablet']),
  deleteTabletValidator,
  deleteTablet,
);

export default router;
