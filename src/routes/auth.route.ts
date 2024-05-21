import express from 'express';
import { register, login, currentUser  , logout} from '../controllers/auth.controller';
import verifyToken from '../lib/middlewares/verifyToken';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/current', verifyToken, currentUser);

router.post('/logout', verifyToken, logout);


export default router;
