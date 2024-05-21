import express from 'express';
import {
  createBox,
  getAllBoxes,
  getBoxById,
  updateBox,
  deleteBox,
} from '../controllers/box.controller';
import {
  createBoxValidator,
  updateBoxValidator,
} from '../validation/box.validation';
import verifyToken from '../middlewares/verifyToken';
import authorize from '../middlewares/authorize';

const router = express.Router();

router
  .route('/')
  .post(
    verifyToken,
    authorize('admin', 'super admin', 'operations'),
    createBoxValidator,
    createBox,
  )
  .get(getAllBoxes);

router
  .route('/:id')
  .get(getBoxById)
  .put(updateBoxValidator, updateBox)
  .delete(deleteBox);

export default router;
