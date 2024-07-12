import express from 'express';
import verifyToken from '../../middlewares/verifyToken';

import {
  createMqttTopic,
  deleteOneMqttTopic,
  getAllMqttTopic,
  getOneMqttTopic,
} from '../../controllers/logs/mqtt.topic.controller';
const router = express.Router();

router.post('/new', createMqttTopic);
router.get('/get-all', verifyToken, getAllMqttTopic);
router.get('/get-one/:id', verifyToken, getOneMqttTopic);
router.delete('/delete/:id', verifyToken, deleteOneMqttTopic);

export default router;
