import { Router } from 'express';
import { uploadImage } from '../../controllers/delivery/image.controller';

const router = Router();

router.post('/upload', uploadImage);

export default router;
