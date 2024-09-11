import express from 'express';
// import verifyToken from '../../middlewares/verifyToken';
// import { authorize } from '../../middlewares/authorize';
import {
  getAllTables,
  getBoxHistory,
  getTableHistory,
} from '../../controllers/user/history.controller';

const router = express.Router();

router.get(
  '/get-all',
  //   verifyToken,
  //   authorize(['read_permission']),
  getAllTables,
);

router.post(
  '/get-one',
  //   verifyToken,
  //   authorize(['read_permission']),
  getTableHistory,
);

router.post(
  '/get-one-box',
  //   verifyToken,
  //   authorize(['read_permission']),
  getBoxHistory,
);

export default router;
