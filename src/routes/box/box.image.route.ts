import express from 'express';
import {
  createBoxImage,
  getAllBoxImages,
  getBoxImageById,
  updateBoxImage,
  deleteBoxImage,
} from '../../controllers/box/box.image.controller';

const router = express.Router();

router.post('/new', createBoxImage);
router.get('/get-all', getAllBoxImages);
router.get('/get-one/:id', getBoxImageById);
router.put('/update/:id', updateBoxImage);
router.delete('/delete/:id', deleteBoxImage);

export default router;
