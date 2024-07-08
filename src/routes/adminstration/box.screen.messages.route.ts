import { Router } from 'express';
import {
  createBoxScreenMessage,
  getAllBoxScreenMessages,
  getBoxScreenMessageById,
  updateBoxScreenMessage,
  deleteBoxScreenMessage,
} from '../../controllers/adminstration/box.screen.messages.controller';
import {
  createBoxScreenMessageValidation,
  getBoxScreenMessageByIdValidation,
  updateBoxScreenMessageValidation,
  deleteBoxScreenMessageValidation,
} from '../../validation/adminstration/box.screen.messages.validation';

const router = Router();

router.post('/new', createBoxScreenMessageValidation, createBoxScreenMessage);
router.get('/get-all', getAllBoxScreenMessages);
router.get(
  '/get-one/:id',
  getBoxScreenMessageByIdValidation,
  getBoxScreenMessageById,
);
router.put(
  '/update/:id',
  updateBoxScreenMessageValidation,
  updateBoxScreenMessage,
);
router.delete(
  '/delete/:id',
  deleteBoxScreenMessageValidation,
  deleteBoxScreenMessage,
);

export default router;
