import express from 'express';
import {
  register,
  login,
  currentUser,
  logout,
} from '../controllers/auth.controller';
import verifyToken from '../middlewares/verifyToken';

import {
  loginValidator,
  registerValidator,
} from '../validation/auth.validation';

const router = express.Router();

router.post('/register', registerValidator, register);

router.post('/login', loginValidator, login);

router.get('/current', verifyToken, currentUser);

router.post('/logout', verifyToken, logout);

export default router;
