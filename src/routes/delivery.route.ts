import express from 'express';
import {
  createDelivery,
  getDeliveries,
  getDelivery,
  updateDelivery,
  deleteDelivery,
} from '../controllers/delivery.controller';
import {
  createDeliveryValidator,
  updateDeliveryValidator,
  deleteDeliveryValidator,
  getOneDeliveryValidator,
} from '../validation/delivery.validation';

const router = express.Router();

router.post('/new', createDeliveryValidator, createDelivery);
router.get('/get-all', getDeliveries);
router.get('/get-one/:id', getOneDeliveryValidator, getDelivery);
router.put('/update/:id', updateDeliveryValidator, updateDelivery);
router.delete('/delete/:id', deleteDeliveryValidator, deleteDelivery);

export default router;
