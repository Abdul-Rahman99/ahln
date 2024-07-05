import express from 'express';
import {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
} from '../../controllers/payment/card.controller';

import {
  createCardValidation,
  getCardByIdValidation,
  updateCardValidation,
  deleteCardValidation,
} from '../../validation/payment/card.validation';
import verifyToken from '../../middlewares/verifyToken';

const router = express.Router();

// CRUD operations
router.post('/new', verifyToken, createCardValidation, createCard);
router.get('/get-all', verifyToken, getAllCards);
router.get('/get-one/:id', verifyToken, getCardByIdValidation, getCardById);
router.put('/update/:id', verifyToken, updateCardValidation, updateCard);
router.delete('/delete/:id', verifyToken, deleteCardValidation, deleteCard);

export default router;
