import express from 'express';
import {
  createBoxGeneration,
  getAllBoxGenerations,
  getBoxGenerationById,
  updateBoxGeneration,
  deleteBoxGeneration,
} from '../../controllers/box/box.generation.controller';

// import {
//   createBoxGenerationValidator,
//   deleteBoxGenerationValidator,
//   getBoxGenerationValidator,
//   updateBoxGenerationValidator,
// } from '../../validation/box/boxGeneration.validation';

import verifyToken from '../../middlewares/verifyToken';
import { authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/new',
  // verifyToken,
  // authorize(['create_box']),
  //   createBoxGenerationValidator,
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
  //   getBoxGenerationValidator,
  getBoxGenerationById,
);

router.put(
  '/update/:id',
  verifyToken,
  authorize(['update_box']),
  //   updateBoxGenerationValidator,
  updateBoxGeneration,
);

router.delete(
  '/delete/:id',
  verifyToken,
  authorize(['delete_box']),
  //   deleteBoxGenerationValidator,
  deleteBoxGeneration,
);

export default router;
