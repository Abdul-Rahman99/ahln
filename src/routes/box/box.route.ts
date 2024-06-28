import express from 'express';
import {
  createBox,
  getAllBoxes,
  getBoxById,
  updateBox,
  deleteBox,
  getBoxesByGenerationId,
} from '../../controllers/box/box.controller';

// import {
//   createBoxValidator,
//   deleteBoxValidator,
//   getBoxValidator,
//   updateBoxValidator,
// } from '../../validation/box/box.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_box']),
  //   createBoxValidator,
  createBox,
);

router.get('/get-all', verifyToken, authorize(['read_box']), getAllBoxes);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_box']),
  //   getBoxValidator,
  getBoxById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box']),
  //   updateBoxValidator,
  updateBox,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box']),
  //   deleteBoxValidator,
  deleteBox,
);

router.get(
  '/get-all/boxes-generation/:generationId',
  verifyToken,
  authorize(['read_box']),
  getBoxesByGenerationId,
);

export default router;
