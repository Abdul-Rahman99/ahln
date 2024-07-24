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
  getAllBoxScreenMessagesValidation,
} from '../../validation/adminstration/box.screen.messages.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = Router();

router.post(
  '/new',
  verifyToken,
  createBoxScreenMessageValidation,
  createBoxScreenMessage,
);
router.get(
  '/get-all',
  verifyToken,
  getAllBoxScreenMessagesValidation,
  getAllBoxScreenMessages,
);
router.get(
  '/get-one/:id',
  verifyToken,
  getBoxScreenMessageByIdValidation,
  getBoxScreenMessageById,
);
router.put(
  '/update/:id',
  verifyToken,
  updateBoxScreenMessageValidation,
  updateBoxScreenMessage,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteBoxScreenMessageValidation,
  deleteBoxScreenMessage,
);

export default router;
