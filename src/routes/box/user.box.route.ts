import express from 'express';
import {
  createUserBox,
  getAllUserBoxes,
  getUserBoxById,
  updateUserBox,
  deleteUserBox,
  getUserBoxesByUserId,
  getUserBoxesByBoxId,
  assignBoxToUser,
} from '../../controllers/box/user.box.controller';

const router = express.Router();

// CRUD operations
router.post('/new', createUserBox);
router.get('/get-all', getAllUserBoxes);
router.get('/get-one/:id', getUserBoxById);
router.put('/update/:id', updateUserBox);
router.delete('/delete/:id', deleteUserBox);

// Additional operations
router.get('/get-user-boxes', getUserBoxesByUserId);
router.get('/get-boxes-user', getUserBoxesByBoxId);
router.post('/assign-box-to-user', assignBoxToUser);

export default router;
