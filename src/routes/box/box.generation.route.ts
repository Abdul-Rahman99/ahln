import express from 'express';
import {
  createBoxGeneration,
  getAllBoxGenerations,
  getBoxGenerationById,
  updateBoxGeneration,
  deleteBoxGeneration,

} from '../../controllers/box/box.generation.controller';

import {
  createBoxGenerationValidation,
  deleteBoxGenerationValidation,
  getBoxGenerationByIdValidation,
  updateBoxGenerationValidation,

} from '../../validation/box/box.generation.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  verifyToken,
  authorize(['create_box']),
  createBoxGenerationValidation,
  createBoxGeneration,
);

router.get(
  '/get-all',
  verifyToken,
  authorize(['read_box']),
  getAllBoxGenerations,
);

router.get(
  '/get-one/:id',
  verifyToken,
  authorize(['read_box']),
  getBoxGenerationByIdValidation,
  getBoxGenerationById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box']),
  updateBoxGenerationValidation,
  updateBoxGeneration,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box']),
  deleteBoxGenerationValidation,
  deleteBoxGeneration,
);

export default router;
