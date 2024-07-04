import express from 'express';
import {
  uploadBoxImage,
  getAllBoxImages,
  getBoxImageById,
  updateBoxImage,
  deleteBoxImage,
  getBoxImagesByBoxId,
  // getBoxImagesByUser,
  getBoxImagesByPackageId,
} from '../../controllers/box/box.image.controller';

const router = express.Router();

router.post('/new', uploadBoxImage);
router.get('/get-all', getAllBoxImages);
router.get('/get-one/:id', getBoxImageById);
router.put('/update/:id', updateBoxImage);
router.delete('/delete/:id', deleteBoxImage);

// router.get('/images-by-user', getBoxImagesByUser);
router.get('/images-by-box/:boxId', getBoxImagesByBoxId);
router.get('/images-by-package/:packageId', getBoxImagesByPackageId);
export default router;
