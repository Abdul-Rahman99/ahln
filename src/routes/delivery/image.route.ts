import { Router } from 'express';
import { uploadImage } from '../../controllers/delivery/image.controller';
import { liveStream } from '../../controllers/delivery/image.controller';
import { getLiveStreamImage } from '../../controllers/delivery/image.controller';


const router = Router();

router.post('/upload', uploadImage);
router.post('/livestream', liveStream);
router.get('/getLiveStreamImage/:id', getLiveStreamImage);


export default router;
