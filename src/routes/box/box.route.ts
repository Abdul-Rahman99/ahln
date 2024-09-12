import express from 'express';
import {
  createBox,
  getAllBoxes,
  getBoxById,
  updateBox,
  deleteBox,
  getBoxesByGenerationId,
  getBoxByTabletInfo,
  assignTabletToBox,
  resetTabletId,
  updateBoxAndAddress,
} from '../../controllers/box/box.controller';

import {
  createBoxValidation,
  deleteBoxValidation,
  getBoxByIdValidation,
  getBoxGenerationByIdValidation,
  updateBoxAndAddressValidation,
  updateBoxValidation,
} from '../../validation/box/box.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_box']),
  createBoxValidation,
  createBox,
);

router.get('/get-all', verifyToken, authorize(['read_box']), getAllBoxes);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_box']),
  getBoxByIdValidation,
  getBoxById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box']),
  updateBoxValidation,
  updateBox,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box']),
  deleteBoxValidation,
  deleteBox,
);

router.get(
  '/get-all/boxes-generation/:generationId',
  verifyToken,
  authorize(['read_box']),
  getBoxGenerationByIdValidation,
  getBoxesByGenerationId,
);

router.post('/set-tablet-id', getBoxByTabletInfo);

router.post(
  '/assign-tablet-to-box',
  verifyToken,
  authorize(['create_tablet']),
  assignTabletToBox,
);

router.post(
  '/reset-tablet-to-box',
  verifyToken,
  authorize(['create_tablet']),
  resetTabletId,
);

router.post(
  '/update-box-label-and-address',
  verifyToken,
  authorize(['update_box']),
  updateBoxAndAddressValidation,
  updateBoxAndAddress,
);

export default router;
