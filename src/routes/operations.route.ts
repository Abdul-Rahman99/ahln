import express from 'express';
import { createOperaion } from '../controllers/operations.controller';

const router = express.Router();

router.post('/new', createOperaion);

export default router;
