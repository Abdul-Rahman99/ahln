import express from 'express';
import verifyToken from '../../middlewares/verifyToken';

import {
  createMqttLog,
  deleteMqttLog,
  getAllMqttLogs,
  getMqttLog,
} from '../../controllers/logs/mqtt.log.controller';
const router = express.Router();

router.post('/new', createMqttLog);
router.get('/get-all', verifyToken, getAllMqttLogs);
router.get('/get-one/:id', verifyToken, getMqttLog);
router.delete('/delete/:id', verifyToken, deleteMqttLog);

export default router;
