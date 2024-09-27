import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import { getAllPlaybackByBox } from '../../controllers/logs/playback.controller';

const router = express.Router();

router.get('/get-all/:box_id', verifyToken, getAllPlaybackByBox);

export default router;
